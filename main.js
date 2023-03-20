$('.btnNewSheet').click(function () {
    var that = this;
    vex.dialog.prompt({
        message: 'Nhập tên sự kiện?',
        placeholder: '',
        callback: function (value) {
            if (value) {
                newSheet(that, value, loadSheetList);
            }
        }
    })
})

$(document).on('click', '.btnDelSheet', function () {
    var that = this;
    var sheetId = $(this).data('sheetid');
    var sheetName = $(this).data('sheetname');
    vex.dialog.confirm({
        overlayClosesOnClick: false,
        unsafeMessage: 'Xoá danh sách <span class="c2">'+sheetName+'</span>?',
        callback: function (value) {
            if (value) {
                delSheet(that, sheetId, '', loadSheetList);
            }
        }
    })
})

loadSheetList();