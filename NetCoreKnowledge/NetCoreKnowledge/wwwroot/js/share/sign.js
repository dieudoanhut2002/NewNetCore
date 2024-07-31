(function(define) {
    define(function(require) {
        var HiloSign = {
            getCertificate:function(){
                return new Promise((resolve, reject) => 
                {                    
                    HiloApi.callApi({
                        type: "POST",
                        url: "/Certificate/Gets",
                        cache:true,
                        timecache: 5*60
                        })
                        .then(value => {
                            if (value.status && (value?.data?.items?.length ?? 0) != 0) {
                                resolve(value.data.items);
                            }
                            else {
                                FlashMessage.showError(value?.userMessage ?? "Không lấy được thông tin chữ ký số trên hệ thống");
                                reject(value?.userMessage);
                            }
                        })
                        .catch(error => {
                            FlashMessage.showError(error);
                            reject(error);
                        })
                        ;
                })
            },
            chooseCertificate: function (Certificates) {
                return new Promise((resolve, reject) => {
                    if (Certificates.length == 0)
                    {
                        FlashMessage.showError(value?.userMessage ?? "Không tìm thấy thông chữ ký số để ký số");
                    }
                    if (Certificates.length == 1)
                        resolve(Certificates[0])
                    else
                    {
                        var $modal = HiloModal.createModal()
                            .setHeaderModal("Chọn chữ kí số để kí")
                        var data = Certificates.forEach((item, index) => {
                            var type = "Token";
                            switch (item.type)
                            {
                                case 2:
                                    type = "USB Token"
                                    break;
                                case 99:
                                    type = "HSM"
                                    break;
                                case 100:
                                    type = "PVcomBank"
                                    break;
                                default:
                                    type ="Chưa xác định"
                                    break;
                            }
                            let view = `Loại CKS: ${type}<br/>CKS: ${item.serial}<br/>Nhà cung cấp: ${item.issuer}<br/>Từ ngày:${item.validFrom}<br/>Đến ngày: ${item.validTo}`;
                            let $button = HiloModal.createButton(view)
                                .addClass("w-100")
                                .addClass("mt-2")
                                .addClass("text-start")
                                .on("click", function () {
                                    HiloSign.chooseCertificate([item]).then(resultSelect => resolve(resultSelect));
                                });
                            $modal.addBodyModal($button)
                        });
                           
                        $modal.showModal(); 
                    }
                })
            },
            signServer: function (dataHash, certSerial, signTag, dataTag) {

                return new Promise(function (myResolve, myReject) {

                    HiloApi.callApi({
                        type: "POST",
                        url: "/SignData/Sign",
                        data: {
                            Data: dataHash,
                            serialCert: certSerial,
                            SignTag: signTag,
                            DataTag: dataTag
                        },
                        dataType: "json",
                    })
                    .then(value => {
                        if (value.status && value.data) {
                            resolve(value.data);
                        }
                        else {

                            FlashMessage.showError(value?.userMessage ?? "Không lấy được thông tin chữ ký số trên hệ thống");
                            reject(value?.userMessage);
                        }
                    })
                    .catch(error => {
                        FlashMessage.showError(error);
                        reject(error);
                    })
                });
            },
            signClient: function (dataHash, certSerial, hashAlgorithm = "SHA1", digestEncryptionAlgorithm = "RSA", maxSize = 10000) {
                return new Promise(function (resolve, reject) {
                    var jsondata = {
                        data: dataHash,
                        certSerial: certSerial,
                        hashAlgorithm: hashAlgorithm,
                        digestEncryptionAlgorithm: digestEncryptionAlgorithm,
                        maxSize: maxSize
                    };
                    HiloApi.callApi({
                        type: "POST",
                        url: "http://localhost:56789/api/Hash/Sign",
                        data: JSON.stringify(jsondata),
                        dataType: "json",
                    })
                    .then(value => {
                        if (value.status && value.data.data) {
                            resolve(value.data.data);
                        }
                        else {

                            FlashMessage.showError(value?.userMessage ?? "Không lấy được thông tin chữ ký số trên hệ thống");
                            reject(value?.userMessage);
                        }
                    })
                    .catch(error => {
                        FlashMessage.showError(error);
                        reject(error);
                    })
                    ;
                });
            },
            chooseSign: function (cert,data) {

                return new Promise((resolve, reject) => {
                    switch (cert.type) {
                        case 2:
                            HiloSign.signClient(data.data, cert.serial).then(value => resolve(value));
                            break;
                        default:
                            HiloSign.signServer(datdataaHash.data, cert.serial, data.signTag, data.dataTag).then(value => resolve(value));
                            break;
                    }
                });
            },
            sign: function(urlGetHash,urlSignHash)
            {
                HiloSign.getCertificate()
                    .then(certs => HiloSign.chooseCertificate(certs))
                    .then(cert => HiloSign.get(urlGetHash, cert)
                        .then(resultData => HiloSign.chooseSign(cert, resultData)
                            .then(resultSign => HiloSign.merge(urlSignHash, resultData, cert, resultSign))
                        )
                    )
                    ;
                    
            },
            get: function (urlGetHash, cert)
            {
                return new Promise(function (resolve, reject) {
                    //urlGetHash = `${urlGetHash}&SerialCert=${cert.serial}`
                    HiloApi.callApi({
                        type: "GET",
                        url: urlGetHash,
                        data: { SerialCert: cert.serial },
                        dataType: "json",
                    })
                    .then(value => {
                        if (value.status) {
                            resolve(value.data);
                        }
                        else {
                            FlashMessage.showError(value?.userMessage ?? "Không lấy được thông tin chữ ký số trên hệ thống");
                            reject(value?.userMessage);
                        }
                    })
                    .catch(error => {
                        FlashMessage.showError(error);
                        reject(error);
                    })
                    ;
                });
            },
            merge: function (urlSignHash, data, cert, hash) {
                return new Promise(function (resolve, reject) {

                    var request = Object.assign({}, data, { SignatureHash: hash })
                    $.ajax({
                        type: "POST",
                        url: urlSignHash,
                        data: request,
                        dataType: "json",
                        success: function (value) {
                            if (value.status) {
                                resolve(value.data);
                            }
                            else {
                                FlashMessage.showError(value?.userMessage ?? "Không lấy được thông tin chữ ký số trên hệ thống");
                                reject(value?.userMessage);
                            }

                        },
                        error: function (err) {
                            FlashMessage.showError(error);
                            reject(error);

                        }
                    });
                });
            },
            init: function()
            {                
                
                jQuery.fn.extend({
                    autoSignData: function(e) {
                        $(this).find("a[sign-get-hash][merge-hash]").off("click").on("click", function (e) {
                            $this = $(this);
                            var urlGetHash = $this.attr("sign-get-hash");
                            var urlSignHash = $this.attr("merge-hash");
                            HiloSign.sign(urlGetHash, urlSignHash)
                        })
                    }
                });
                $(document).autoSignData();
                return HiloSign;
            }
        };

        return HiloSign.init();
    });
})(typeof define === 'function' && define.amd ? define : function(factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        window.HiloSign = factory(window.jQuery);
    }
});