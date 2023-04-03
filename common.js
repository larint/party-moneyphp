var apisite = './api.php';
function PrintElem(elem, title) {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    mywindow.document.write(`<html><head><title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
        <style>
            .table-success, .table-success>td, .table-success>th {
                background-color: #c3e6cb;
            }
            .table-bordered {
                border: 1px solid #dee2e6;
            }
            .table {
                width: 100%;
                margin-bottom: 1rem;
                color: #212529;
            }
            table {
                border-collapse: collapse;
            }
            .table-success thead th {
                border-color: #8fd19e;
            }
            .table-bordered thead td, .table-bordered thead th {
                border-bottom-width: 2px;
            }
            .table thead th {
                vertical-align: bottom;
                border-bottom: 2px solid #dee2e6;
            }
            .table-bordered td, .table-bordered th {
                border: 1px solid #dee2e6;
            }
            .table-sm td, .table-sm th {
                padding: 5px;
            }
            .table td, .table th {
                padding: 5px;
                vertical-align: top;
                border-top: 1px solid #dee2e6;
            }
        </style>
        </head><body>
        <h1>${title}</h1>
        ${document.getElementById(elem).innerHTML}
        </body></html>`
    );

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

function delSheet(selector, sheetId, location = '', callback = null) {
    $.ajax({
        type: 'POST',
        url: apisite,
        data: { r: 'delSheet', sheetId },
        beforeSend: function () {
            $(selector).find('span').css({ display: 'inline-block'});
        },
        success: function (res) {
            toastr.success('Đã xoá!');
            console.log(location);
            if (location) {
                window.location.href = location;
            }
            if (callback) {
                callback()
            }
        },
        error: function (res) {
            toastr.error(res.statusText);
        },
        complete: function () {
            $(selector).find('span').css({ display: 'none'});
        }
    })
}

function newSheet(selector, value, callback) {
    $.ajax({
        type: 'POST',
        url: apisite,
        data: { r: 'newSheet', name: value },
        beforeSend: function () {
            $(selector).prop('disabled', true);
            $(selector).find('span').css({ display: 'inline-block'});
        },
        success: function (res) {
            toastr.success('Đã tạo mới!');
            callback();
        },
        error: function (res) {
            toastr.error('Lỗi tạo bảng tính mới!');
        },
        complete : function () {
            $(selector).prop('disabled', false);
            $(selector).find('span').css({ display: 'none'});
        }
    })
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function loadSheetList() {
    $.ajax({
        type: 'POST',
        url: apisite,
        data: { r : 'getSheets' },
        beforeSend: function () {
            $('.tb-scroll').html('Đang tải danh sách...')
        },
        success: function (res) {
            $('.tb-scroll').html(res)
        },
        complete: function () {

        }
    })
}

function loadSheetData(callback = null) {
    $.ajax({
        type: 'POST',
        url: apisite,
        data: { r: 'getSheetDetail', sheetname, sheetId },
        beforeSend: function () {
            $('#list-detail').html('Đang tải danh sách...')
        },
        success: function (res) {
            sheetData = res.sheetData;
            var outCus = sheetData.filter(function (e) {
                return typeof e[3] === 'undefined';
            });
            $('.action-top .text-success>span.ctotal').html(sheetData.length);
            $('input[name="id"]').val(res.maxIndex + 1);
            $('span.t-count').html(res.maxIndex + 1);
            $('#list-detail').html(res.htmlData);
            $('.cso .in').html(sheetData.length - outCus.length);
            $('.cso .out').html(outCus.length);
            if (callback) {
                callback(sheetData);
            }
            document.dispatchEvent(new CustomEvent('evtLoadSheetData', {
                detail: {sheetData},
                cancelable: true,
            }));
        },
        error: function () {
            toastr.error('Lỗi tải dữ liệu');
        }
    })
}

function delSheetRow(selector, sheetId, indexRow, callback) {
    $.ajax({
        type: 'POST',
        url: apisite,
        data: { r: 'delSheetRow', sheetId, indexRow },
        beforeSend: function () {
            $(selector).find('span').css({ display: 'inline-block'});
            $(selector).prop('disabled', true);
        },
        success: function (res) {
            toastr.success('Đã xoá!');
            callback();
        },
        error: function (res) {
            toastr.error(res.statusText);
        },
        complete: function () {
            $(selector).find('span').css({ display: 'inline-block'});
            $(selector).prop('disabled', true);
        }
    })
}

function addSheetRow(selector, datanew, callback) {
    $.ajax({
        type: 'POST',
        url: apisite,
        data: Object.assign({ r: 'addSheetRow' }, datanew),
        beforeSend: function () {
            selector.find('span').css({ display: 'inline-block'});
            selector.prop('disabled', true);
        },
        success: function (res) {
            toastr.success('Đã cập nhật!');
            callback();
        },
        error: function (res) {
            toastr.error('Lỗi cập nhậ!');
        },
        complete: function name(params) {
            selector.find('span').css({ display: 'none'});
            selector.prop('disabled', false);
            $('input[name="name"], input[name="amount"], input[name="amount1"]').val('');
        }
    })
}

function updateSheetRow(selector, sheetname, indexRow, amount, callback) {
    $.ajax({
        type: 'POST',
        url: apisite,
        data: { r: 'updateSheetRow', sheetname, indexRow, amount },
        beforeSend: function () {
            selector.find('span').css({ display: 'inline-block'});
            selector.prop('disabled', true);
        },
        success: function (res) {
            toastr.success('Đã cập nhật!');
            callback();
        },
        error: function (res) {
            toastr.error('Lỗi cập nhậ!');
        },
        complete: function name(params) {
            selector.find('span').css({ display: 'none'});
            selector.prop('disabled', false);
        }
    })
}

function updateName(selector, sheetname, indexRow, pref, name, callback) {
    $.ajax({
        type: 'POST',
        url: apisite,
        data: { r: 'updateName', sheetname, indexRow, pref, name },
        beforeSend: function () {
            selector.find('span').css({ display: 'inline-block'});
            selector.prop('disabled', true);
        },
        success: function (res) {
            toastr.success('Đã cập nhật!');
            callback();
        },
        error: function (res) {
            toastr.error('Lỗi cập nhậ!');
        },
        complete: function name(params) {
            selector.find('span').css({ display: 'none'});
            selector.prop('disabled', false);
        }
    })
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}