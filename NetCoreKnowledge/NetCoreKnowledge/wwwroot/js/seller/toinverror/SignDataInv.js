
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

function GetData(serial, id) {
    var jsonData = {
        ID: id,
        serialCert: serial

    };
    return new Promise(function (myResolve, myReject) {
        $.ajax({
            type: "POST",
            url: "/TOInvError/GetData",
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
            url: "/TOInvError/MergeData",
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
            return MergeData(id, results.data);
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
        return MergeData(id, results);
    }).then(resultData => {
        ShowToastSuccess("Thông báo", resultData.userMessage);
        setTimeout(500);
        location.reload();
    }).catch(error => {
        ShowToastError("Lỗi", error);
    })
} 



