loadSheetData();

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

$('.form-new').submit(function () {
    var selector = $(this).find('button[type="submit"]');
    var queryString = $(this).serializeArray();
    var datanew = {
        prefixname : queryString[2].value,
        name : queryString[3].value,
        sheetname: queryString[1].value,
        id : queryString[0].value
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
        prefixname : queryString[2].value,
        name : queryString[3].value,
        sheetname: queryString[1].value,
        id : queryString[0].value,
        amount : queryString[4].value
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
        var indexr = $('#'+val).data('indexr');
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