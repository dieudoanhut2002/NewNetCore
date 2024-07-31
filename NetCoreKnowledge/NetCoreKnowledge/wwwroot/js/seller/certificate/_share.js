$(document).on('change', '.certificate-type', async function () {
    var selectedValue = parseInt($(this).val());
    console.log('Giá trị đã chọn:', selectedValue);

    $("#usb-token-tab").prop("disabled", true);
    $("#easyca-tab").prop("disabled", true);
    $("#ncca-tab").prop("disabled", true);
    $("#ica-tab").prop("disabled", true);
    $("#hiloca-tab").prop("disabled", true);
    $("#pvcombankca-tab-tab").prop("disabled", true);

    $("#usb-token-tab").prop("aria-selected", true);
    $("#easyca-tab").prop("aria-selected", true);
    $("#ncca-tab").prop("aria-selected", true);
    $("#ica-tab").prop("aria-selected", true);
    $("#hiloca-tab").prop("aria-selected", true);
    $("#pvcombankca-tab").prop("aria-selected", true);

    $("#usb-token-tab").removeClass("active");
    $("#easyca-tab").removeClass("active");
    $("#ncca-tab").removeClass("active");
    $("#ica-tab").removeClass("active");
    $("#hiloca-tab").removeClass("active");
    $("#pvcombankca-tab").removeClass("active");

    $("#usb-token-tab-pane").removeClass("show active");
    $("#easyca-tab-pane").removeClass("show active");
    $("#ncca-tab-pane").removeClass("show active");
    $("#ica-tab-pane").removeClass("show active");
    $("#hiloca-tab-pane").removeClass("show active");
    $("#pvcombankca-tab-pane").removeClass("show active");

    switch (selectedValue) {
        //USB Token
        case 2: {
            $("#usb-token-tab").prop("disabled", false);
            $("#usb-token-tab").prop("aria-selected", false);

            $("#usb-token-tab").addClass("active");
            $("#usb-token-tab-pane").addClass("show active");
            break;
        }
        //EasyCA
        case 4: {
            
            $("#easyca-tab").prop("disabled", false);
            $("#easyca-tab").prop("aria-selected", true);
            
            $("#easyca-tab").addClass("active");
            $("#easyca-tab-pane").addClass("show active");
            break;
        }
        //NCCA
        case 5: {
            $("#ncca-tab").prop("disabled", false);
            $("#ncca-tab").prop("aria-selected", true);

            $("#ncca-tab").addClass("active");
            $("#ncca-tab-pane").addClass("show active");
            break;
        }
        //ICA
        case 6: {
            $("#ica-tab").prop("disabled", false);
            $("#ica-tab").prop("aria-selected", true);

            $("#ica-tab").addClass("active");
            $("#ica-tab-pane").addClass("show active");
            break;
        }
        //HiloCA
        case 99: {
            $("#hiloca-tab").prop("disabled", false);
            $("#hiloca-tab").prop("aria-selected", true);

            $("#hiloca-tab").addClass("active");
            $("#hiloca-tab-pane").addClass("show active");
            break;
        }

        //PVCombankCA
        case 100: {
            $("#pvcombankca-tab").prop("disabled", false);
            $("#pvcombankca-tab").prop("aria-selected", true);

            $("#pvcombankca-tab").addClass("active");
            $("#pvcombankca-tab-pane").addClass("show active");
            break;
        }
    }

});

function GetInforUSBTokenCertificate() {
    return new Promise(function (myResolve, myReject) {
        $.ajax({
            type: "GET",
            url: "http://localhost:56789/api/Certificate/Get",
            crossDomain: true,
            success: function (result) {
                if (result.status == true) {
                    var certificate = result.data.certBase64;
                    $("#CerPublic").val(certificate);

                    var jsondata = {
                        base64Certificate: certificate,
                    };
                    myResolve(jsondata);
                }
                else {
                    ShowToastError("Lỗi", result.userMessege)
                }
                
                
            },
            error: function (err) {
                
                myReject(err);

            }
        });
    });
}

function ShowDataInfor(jsonCert) {
    return new Promise(function (myResolve, myReject) {
        $.ajax({
            type: "POST",
            url: "/Certificate/ShowData",
            data: jsonCert,
            dataType: "json",
            success: function (result) {
                myResolve(result)
            },
            error: function (err) {
                myReject(err);
            }
        });
    });
    
}

function chooseCACert() {
    return new Promise(function (myResolve, myReject) {


        // Tạo một FormData object để lấy dữ liệu từ form
        var formData = new FormData($('form')[0]);
        // Tạo một plain object để chứa dữ liệu
        var data = {};
        // Lặp qua FormData để đổ dữ liệu vào plain object
        formData.forEach(function (value, key) {
            data[key] = value;
        });

        $.ajax({
            type: "POST",
            url: "/Certificate/ReadCert",
            data: data,
            dataType: "json",
            success: function (result) {
                $("#CerPublic").val(result.apiResult.data);
                var jsonRequest = {
                    base64Certificate: result.apiResult.data
                };
                myResolve(jsonRequest)

            },
            error: function (err) {
                myReject(err)
            }
        });
    });


};
///===============================Lấy thông tin Cert=============================================

function GetCert() {
    var selectType = parseInt($('.certificate-type').val());
    switch (selectType) {
        //USB Token
        case 2: {
            GetInforUSBTokenCert();
            break;
        }
        case 99:
        case 100:
        {
            GetInforCACert();
            break;
        }        
        case 4:
        case 5:
        case 6:{
                break;
            }             
        
    }

}

function GetInforUSBTokenCert() {
    GetInforUSBTokenCertificate().then(resultData => {
        console.log("Đã lấy thông tin GetCertUSBToken");
        return ShowDataInfor(resultData);
    }).then(resultShowData => {
        if (resultShowData.status == true) {
            $("#Serial").val(resultShowData.data.serial);
            $("#Subject").val(resultShowData.data.subject);
            $("#Issuer").val(resultShowData.data.issuer);
            $("#ValidFrom").val(resultShowData.data.validFrom);
            $("#ValidTo").val(resultShowData.data.validTo);

        }
        else {
            ShowToastError("Lỗi", resultShowData.userMessage);
        }
    }).catch(error => {
        console.log(error);
    })
}

function GetInforCACert() {
    chooseCACert().then(resultData => {
        console.log("Đã lấy thông tin chooseCACert");
        return ShowDataInfor(resultData)
        }).then(resultShowData => {
            if (resultShowData.status == true) {
                $("#Serial").val(resultShowData.data.serial);
                $("#Subject").val(resultShowData.data.subject);
                $("#Issuer").val(resultShowData.data.issuer);
                $("#ValidFrom").val(resultShowData.data.validFrom);
                $("#ValidTo").val(resultShowData.data.validTo);
            }
            else {
                ShowToastError("Lỗi", resultShowData.userMessage);
            }
        
    }).catch(error => {
        console.log(error);
        
    })
};



