$('[addrow]').addEvent("click", function () {
    $(this).addRow();
});
$('.remove-button').on('click', function () {
    $(this).removeRow();
});

jQuery.fn.extend({
    addRow: function () {
        this.removeSelect2();
        var tableId = "#" + $(this).attr("addRow");
        var table = $(tableId);
        var firstRow = table.find('tbody tr:first');
        var newRow = firstRow.clone();
        newRow.find('textarea,input').prop('checked', false).val("");
        newRow.appendTo(table);
        newRow.addSelect2();
        table.updateRowNumbers();
        return newRow;
    },
    removeRow: function () {
        var tableId = '#' + $(this).attr('removerow');
        var table = $(tableId);
        var rowCount = table.find(`tbody tr`).length;
        if (rowCount > 1) {
            $(this).closest('tr').remove();
        }
        else {
            ShowToastError("Thông báo", "Bảng cần tối thiểu 1 dòng dữ liệu");
        }
        table.updateRowNumbers();

    },
    updateRowNumbers: function () {
        this.find('tbody tr').each(function (index) {
            $(this).find('td:first').text(index + 1);
            $(this).find('input, select').each(function () {
                var name = $(this).attr('name');
                if (name) {
                    var newName = name.replace(/\[\d+\]/, '[' + index + ']');
                    $(this).attr('name', newName);
                }
            });
        });
        initEvent();
    },
});

var initEvent = function () {
    $('#toInvErrorTable').find('.invRange').addEvent('select2:select', function () {
        var $row = $(this).closest('tr');
        var invNo = $row.find('.invNo').val();
        var invRangeID = $(this).val();
        var $invID = $row.find('.invID');
        var $invDate = $row.find('.invDate');
        var taxAgencyCode = $row.find('.taxAgencyCode');
        $invDate.val(null);
        taxAgencyCode.val(null);
        if (!isNullOrWhitespace(invRangeID) && (!isNullOrWhitespace(invNo))) {
            CallAjax("GET", `/InvVAT/Gets?Filter.InvRangeID=${invRangeID}&Filter.No=${invNo}`, null, function (response) {
                taxAgencyCode.val(response.data.items[0].taxAgencyCode);
                var responsedDate = response.data.items[0].date;
                $invID.val(response.data.items[0].id);
                if (responsedDate) {
                    var datePart = responsedDate.split('T')[0];
                    $invDate.val(datePart);                    
                }                
            })
        }
        //var result = productTaxAmountDefault($row);
        //result = parseFloat(result);

        //$row.find('.productTaxAmount')
        //    .val(result)
        //    .trigger("change");        
    });
    $('#toInvErrorTable').find('.invNo').addEvent('change', function () {
        var $row = $(this).closest('tr');
        var invRangeID = $row.find('.invRange').val();
        var $invID = $row.find('.invID');
        var invNo = $(this).val();
        var $invDate = $row.find('.invDate');
        var taxAgencyCode = $row.find('.taxAgencyCode');
        $invDate.val(null);
        taxAgencyCode.val(null);
        if (!isNullOrWhitespace(invRangeID) && !isNullOrWhitespace(invNo)) {
            CallAjax("GET", `/InvVAT/Gets?Filter.InvRangeID=${invRangeID}&Filter.No=${invNo}`, null, function (response) {               
                
                taxAgencyCode.val(response.data.items[0].taxAgencyCode);
                var responsedDate = response.data.items[0].date;
                $invID.val(response.data.items[0].id);
                if (responsedDate) {
                    var datePart = responsedDate.split('T')[0];
                    $invDate.val(datePart);
                }
            })
        }
        //var result = productTaxAmountDefault($row);
        //result = parseFloat(result);

        //$row.find('.productTaxAmount')
        //    .val(result)
        //    .trigger("change");        
    });

    $('#toInvErrorTable').find('.remove-button').addEvent('click', function () {
        $(this).removeRow();
    });
};
initEvent();


/*========================================Hiển thị kiểu date nhưng khi submit thì gửi kiểu date-time*/
$('input[type="datetime-local"].date-only').each(function () {
    var $input = $(this);
    var value = $input.val();

    if (value) {
        var datePart = value.split('T')[0];
        $input.val(datePart + 'T00:00');
    }
});
function isNullOrWhitespace(input) {
    return (typeof input === 'undefined' || input == null)
        || input.replace(/\s/g, '').length < 1;
}
