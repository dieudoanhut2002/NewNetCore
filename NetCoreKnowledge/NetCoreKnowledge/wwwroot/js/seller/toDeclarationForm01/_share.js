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
        newRow.find(".organizationName, .serial, .fromTime, .toTime").cleardata();
        newRow.appendTo(table);
        newRow.removeSelect2().addSelect2();
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
    }, cleardata: function () {
        return this.each(function () {
            if ($(this).is('input, select, textarea')) {
                $(this).val('');
            } else {
                $(this).text('');
            }
        });
    },
});
    function updateSubmitButtonState() {
        var rowCount = $('#certificatesTable tbody tr').length;
        $('#submitForm').prop('disabled', rowCount === 0);
    }


    $(document).on('click', '.remove-button', function () {
        $(this).closest('tr').remove();
        updateSubmitButtonState();
    });

    updateSubmitButtonState();


function SendToTCTN(Id) {
    CertificateGets()
        .then(value => {
            switch (value.type) {
                case 2:
                    return PublishUsbToken(value.serial, Id);
                case 99:
                    return PublishHSM(value.serial, Id);
                case 100:
                    return PublishHSM(value.serial, Id);

            }
        });

}


function GetData(serial,id) {
    var jsonData = {
        ID: id,
        serialCert: serial

    };
    return new Promise(function (myResolve, myReject) {
        $.ajax({
            type: "POST",
            url: "/TODeclarationForm01/GetData",
            data: jsonData,
            dataType: "json",
            success: function (result) {
                console.log("Đã hash dữ liệu tờ khai thành công");
                myResolve(result);

            },
            error: function (err) {
                console.log(err);
                myReject(err);

            }
        });
    });
}

function MergeData(id, signature) {
    var jsonData = {
        ID: id,
        SignatureHash: signature

    };
    return new Promise(function (myResolve, myReject) {
        $.ajax({
            type: "POST",
            url: "/TODeclarationForm01/MergeData",
            data: jsonData,
            dataType: "json",
            success: function (result) {
                console.log("Bắt đầu ghép dữ liệu");
                myResolve(result);

            },
            error: function (err) {
                console.log(err);
                myReject(err);

            }
        });
    });
}

function PublishHSM(serial, id) {
    GetData(serial, id).then(value => {
        console.log("Lấy thông tin hash xml thành công");
        return {
            Data: value.data.data,
            serialCert: value.data.serial,
            SignTag: value.data.signTag,
            DataTag: value.data.dataTag
        }
    }).then(result => {
        console.log("Bắt đầu kí dữ liệu");
        return SignCA(result)
    })
    .then(results => {
        console.log("Kí dữ liệu thành công: " + results);
        return MergeData(id,results.apiResult.data);
    }).then(resultData => {
        ShowToastSuccess("Thông báo", resultData.userMessage);
    }).catch(error => {
        ShowToastError("Lỗi", error);
    })
}

function PublishUsbToken(serial, id) {
    GetData(serial, id).then(result => {
        console.log("Lấy thông tin hash thành ông")
            return SignUsbToken(result.data.data, result.data.serial);       
    }).then(results => {
        console.log("Kí dữ liệu thành công: " + results);
        return MergeData(id,results);
    }).then(resultData => {
        ShowToastSuccess("Thông báo", resultData.userMessage);
        setTimeout(500);
        location.reload();
    }).catch(error => {
        ShowToastError("Lỗi", error);
    })
} 


///===================================Xử lý logic checkbox khi tạo hoá đơn=====================================
$('#HasTaxAuthorityCode').on('change', function () {
    if ($(this).is(':checked')) {
        $('#HasDifficultCode, #HasHighTechCode, #SendDirectlyToTheTaxAuthority, #ThroughATO').prop('disabled', true);
        $('#SendInFull').prop('checked', true);
        $('#SendSummaryTable').prop('checked', false);
    } else {
        $('#HasDifficultCode, #HasHighTechCode, #SendDirectlyToTheTaxAuthority, #ThroughATO').prop('disabled', false);
        $('#SendInFull').prop('checked', false);
    }
});


