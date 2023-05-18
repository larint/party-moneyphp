var mchart;
function prfixnamesSelect(prfixnames, nameOld) {
    var pref = nameOld.split(':')[0];
    var txt = '';
    prfixnames.forEach(function (name) {
        var selected = pref == name ? 'selected' : '';
        txt += '<option value="'+name+'" '+selected+'>'+name+'</option>';
    });
    return `
    <label>Câp nhật tên cũ <b>${nameOld}</b></label>
    <div class="d-flex">
        <select class="form-control mb-2 w-auto" name="prefixname">
            ${txt}
        </select>
        <input class="form-control ml-1" type="text" required="" name="name" placeholder="Tên cần đổi">
    </div>
    `;
}
function calLabelDataChartFromSheet(dataSheet) {
    var money = dataSheet.filter(function (el) {
        return el[3] && !isNaN(el[3]);
    }).map(function (el) {
        return parseInt(el[3]);
    });

    var countMoney = money.reduce(function(prev, cur) {
        prev[cur] = (prev[cur] || 0) + 1;
        return prev;
    }, {});
    return countMoney;
}

function loadChart(dataSheet) {
    const ctx = document.getElementById('myChart');
    var labelPoint = calLabelDataChartFromSheet(dataSheet);
    var labels =  Object.keys(labelPoint).map(function (el) {
        return [numberWithCommas(el) + 'đ', labelPoint[el] + ' khách'];
    });

    const data = {
        labels: labels,
        datasets: [{
            label: 'Tỷ lệ',
            data: Object.values(labelPoint),
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(155, 205, 86)',
                'rgb(195, 205, 86)',
                'rgb(55, 105, 86)',
                'rgb(225, 15, 86)',
                'rgb(25, 115, 86)',
                'rgb(15, 95, 86)',
                'rgb(95, 15, 86)',
                'rgb(35, 215, 86)'
            ],
            hoverOffset: 4
        }]
    };
    var options = {
        plugins: {
            tooltip: {
                enabled: false
            },
            legend: {
                position: 'left',
                labels: {
                    boxWidth: 15,
                    boxHeight: 20,
                    padding: 5,
                    useBorderRadius: true,
                    borderRadius: 2
                }
            }
        }
    };

    const alwayShowTooltip = {
        id: 'alwayShowTooltip',
        afterDraw(chart, args, options) {
            const { ctx } = chart;
            ctx.save();
            chart.data.datasets.forEach(function (datasets, i) {
                var total = chart.data.datasets[i].data.reduce(function (t, a) {
                    return t + a;
                }, 0);
                chart.getDatasetMeta(i).data.forEach(function (datapoint, j) {
                    const {x, y} = datapoint.tooltipPosition();
                    var percent = Math.round(chart.data.datasets[i].data[j] / total * 100);
                    const text = percent + '%' ;
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    // ctx.fillRect(x, y,10,10);
                    ctx.fillText(text, x, y);
                    ctx.font = '12px Arial';
                    ctx.restore();
                })
            })
        }
    };
   
    mchart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options,
        plugins: [alwayShowTooltip]
    });
}

document.addEventListener("evtLoadSheetData", (event) => {
    var sheetData = event.detail.sheetData;
    updateChart(sheetData);
});

function updateChart(dataSheet) {
    if (mchart) {
        var labelPoint = calLabelDataChartFromSheet(dataSheet);
        var labels =  Object.keys(labelPoint) .map(function (el) {
            return [numberWithCommas(el) + 'đ', labelPoint[el] + ' khách'];
        });
        mchart.data.labels = labels;
        mchart.data.datasets[0].data = Object.values(labelPoint);
        mchart.update();
    }
}

$(document).on('click', '.btnDelSheet', function () {
    var that = this;
    var sheetId = $(this).data('sheetid');
    vex.dialog.confirm({
        overlayClosesOnClick: false,
        message: 'Xoá danh sách?',
        callback: function (value) {
            if (value) {
                delSheet(that, sheetId, $('body').data('site'));
            }
        }
    })
})

$(document).on('click', '.btnDelRow', function () {
    var that = this;
    var indexRow = $(this).data('index');
    vex.dialog.confirm({
        overlayClosesOnClick: false,
        message: 'Xoá dòng này?',
        callback: function (value) {
            if (value) {
                delSheetRow(that, sheetId, indexRow, loadSheetData);
            }
        }
    })
})

$(document).on('click', '.btnUpdateName', function () {
    var that = this;
    var indexRow = $(this).data('index');
    var nameOld = $(this).data('name');
    vex.dialog.open({
        input: [
            prfixnamesSelect(prfixnames, nameOld)
        ].join(''),
        callback: function (data) {
            if (data) {
                updateName($(that), sheetname, indexRow, data.prefixname, data.name, loadSheetData);
            } else {
                toastr.error('Vui lòng nhập tên.');
            }
        }
    })
})

$('.form-new').submit(function () {
    var selector = $(this).find('button[type="submit"]');
    var queryString = $(this).serializeArray();
    var datanew = {
        prefixname: queryString[2].value,
        name: queryString[3].value,
        sheetname: queryString[1].value,
        id: queryString[0].value
    };
    var check = sheetData.filter(function (x) {
        return x[1].toUpperCase() == datanew.prefixname.toUpperCase() && x[2].toUpperCase() == datanew.name.toUpperCase();
    })
    if (check.length > 0) {
        toastr.warning('Tên đã có rồi!');
        return false;
    }
    addSheetRow(selector, datanew, loadSheetData);
    return false;
})

$('.form-new1').submit(function () {
    var selector = $(this).find('button[type="submit"]');
    var queryString = $(this).serializeArray();
    var datanew = {
        prefixname: queryString[2].value,
        name: queryString[3].value,
        sheetname: queryString[1].value,
        id: queryString[0].value,
        amount: queryString[4].value
    };
    var check = sheetData.filter(function (x) {
        return x[1].toUpperCase() == datanew.prefixname.toUpperCase() && x[2].toUpperCase() == datanew.name.toUpperCase();
    })
    if (check.length > 0) {
        toastr.warning('Tên đã có rồi!');
        return false;
    }
    addSheetRow(selector, datanew, loadSheetData);
    return false;
})

$('.form-update').submit(function () {
    var btn = $('.btn-update-row');
    var queryString = $(this).serializeArray();
    var sheetname = queryString[0].value;
    var stt = queryString[1].value;
    var indexRow = queryString[2].value;
    var amount = queryString[3].value;
    var rowFind = sheetData.filter(function (x) {
        return x[0] == stt;
    });

    if (rowFind.length > 0) {
        updateSheetRow(btn, sheetname, indexRow, amount, loadSheetData);
    } else {
        toastr.warning('Tên chưa có trong danh sách');
    }
    setTimeout(function () {
        $('input[name="amount"]').val('');
        $('input[name="stt"]').val('');
        $('.name-search').text('');
    }, 500);
    return false;
})

$('.stt').on('input', function () {
    var val = $(this).val();
    var name = sheetData.filter(function (x) {
        return x[0] == val;
    });
    if (name.length > 0) {
        $('.name-search').text(name[0][1] + ' ' + name[0][2]);
        var indexr = $('#' + val).data('indexr');
        $('input[name="indexRow"]').val(indexr);
    } else {
        $('.name-search').text('');
        $('input[name="indexRow"]').val(0);
    }
});

$('.amoutbox>span').click(function () {
    var amount = $(this).data('amount');
    $('input[name="amount"]').val(amount);
});

$('.amoutbox1>span').click(function () {
    var amount = $(this).data('amount');
    $('input[name="amount1"]').val(amount);
});

$('.btn-save-image').click(function(e){
    html2canvas(document.getElementById("list-detail")).then(function(canvas) {
    	var a = document.createElement('a');
		a.href = canvas.toDataURL("image/jpeg");
		a.download = "danh_sach_khach.jpeg";
		document.body.appendChild(a);
		a.click();
	});
});
        
loadSheetData(loadChart);