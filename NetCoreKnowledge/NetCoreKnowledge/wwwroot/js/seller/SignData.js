function CertificateGets() {
    return new Promise(function (myResolve, myReject) {
        CallAjaxPromise({
            type: "POST",
            url: "/Certificate/Gets",

        })
            .then(result => {
                var signTokenCAList = $("#modalCA-item_tokenCAList");
                signTokenCAList.empty(); // Xóa danh sách cũ nếu có
                var signHsmCAList = $("#modalCA-item_hsmCAList");
                signHsmCAList.empty(); // Xóa danh sách cũ nếu có
                result.data.items.forEach(function (item) {
                    switch (item.type) {
                        case 2:
                            let _newButton = $("<button>")
                                .addClass("btn btn-secondary w-100")
                                .attr("type", "button")
                                .html(item.serial)
                                .on("click", function () {
                                    $("#modalCA").modal('hide');
                                    myResolve(item)
                                });
                            signTokenCAList.append(_newButton);
                            break;
                        case 99:
                            let _newButtonHSM = $("<button>")
                                .addClass("btn btn-secondary w-100")
                                .attr("type", "button")
                                .html(item.serial)
                                ;
                            _newButtonHSM.on("click", function () {
                                $("#modalCA").modal('hide');
                                myResolve(item)

                            })
                            signHsmCAList.append(_newButtonHSM);
                            break;
                        case 100:
                            let _newButtonHSMpvCombank = $("<button>")
                                .addClass("btn btn-secondary w-100")
                                .attr("type", "button")
                            myResolve(item)
                                ;
                            _newButtonHSMpvCombank.on("click", function () {
                                $("#modalCA").modal('hide');
                                myResolve(item)

                            })
                            signHsmCAList.append(_newButtonHSMpvCombank);
                            break;
                    }
                });
            })
            .catch(err => myReject(err));
    });

}


function SignCA(jsondata) {    
    return new Promise(function (myResolve, myReject) {
        $.ajax({
            type: "POST",
            url: "/SignData/Sign",
            data: jsondata,
            dataType: "json",
            success: function (result) {
                myResolve(result);

            },
            error: function (err) {
                console.log(err);
                myReject(err);

            }
        });
    });
   
}


function SignUsbToken(dataHash, certSerial, hashAlgorithm = "SHA1", digestEncryptionAlgorithm = "RSA", maxSize = 10000) {
    var jsondata = {
        data: dataHash,
        certSerial: certSerial,
        hashAlgorithm: hashAlgorithm,
        digestEncryptionAlgorithm: digestEncryptionAlgorithm,
        maxSize: maxSize
    };
    return new Promise(function (myResolve, myReject) {
        $.ajax({
            type: "POST",
            url: "http://localhost:56789/api/Hash/Sign",
            data: JSON.stringify(jsondata),
            dataType: "json",
            success: function (result) {
                if (result.status == true) {
                    console.log("Lấy thông tin hash xml thành công");
                    myResolve(result.data.data)
                }
                else {
                    myReject(result.userMessege);
                }


            },
            error: function (err) {
                console.log(err);
                myReject(err)

            }
        });
    });
}