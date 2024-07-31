
function SendToTCTN(Id, invRangeId) {
    AssignNo(Id, invRangeId)
        .then(values => CertificateGets())
        .then(value => {
            switch (value.type) {
                case 2:
                    return PublishUsbToken(value.serial, Id, invRangeId);
                case 99:
                    return PublishHSM(value.serial, Id, invRangeId);
                case 100:
                    return PublishHSM(value.serial, Id, invRangeId);

            }
        })
        .catch(err => ShowToastError(err))
        ;

}

function GetData(value, id, invRangeId) {

    var jsondata = {
        serialCert: value,
        ID: id,
        InvRangeID: invRangeId
    };
    return new Promise(function (myResolve, myReject) {
        $.ajax({
            type: "POST",
            url: "/InvVAT/GetData",
            data: jsondata,
            dataType: "json",
            success: function (result) {
                console.log("Đã lấy thông tin hash của tờ khai");
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
            url: "/InvVAT/MergeData",
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

function PublishHSM(serial, id, invRangId) {
    GetData(serial, id, invRangId).then(value => {
        console.log("Lấy thông tin hash xml thành công");
        return {
            Data: value.apiResult.data.data,
            serialCert: value.apiResult.data.serial,
            SignTag: value.apiResult.data.signTag,
            DataTag: value.apiResult.data.dataTag
        }
    }).then(result => {
        console.log("Bắt đầu kí dữ liệu");
        return SignCA(result)
    })
        .then(results => {
            console.log("Kí dữ liệu thành công: " + results);
            return MergeData(id, results.apiResult.data);
        }).then(resultData => {
            ShowToastSuccess("Thông báo", resultData.apiResult.userMessage);
            setTimeout(500);
            location.reload();
        }).catch(error => {
            ShowToastError("Lỗi", error);
        })
}

function PublishUsbToken(serial, id, invRangId) {
    GetData(serial, id, invRangId).then(result => {
        console.log("Lấy thông tin hash thành ông")
        return SignUsbToken(result.apiResult.data.data, result.apiResult.data.serial);
    }).then(results => {
        console.log("Kí dữ liệu thành công: " + results);
        return MergeData(id, results);
    }).then(resultData => {
        ShowToastSuccess("Thông báo", resultData.apiResult.userMessage);
        setTimeout(500);
        location.reload();
    }).catch(error => {
        ShowToastError("Lỗi", error);
    })
} 


//=====================================Quản lí cấp số===================================
function AssignNo(Id, invRangeId) {
    var jsondata = {
        ID: Id,
        InvRangeID: invRangeId
    };
    return new Promise(function (myResolve, myReject) {
        $.ajax({
            type: "POST",
            url: "/InvVAT/NoAssign",
            data: jsondata,
            dataType: "json",
            success: function (result) {
                if (result?.apiResult?.status)
                    myResolve(result.apiResult.data)
                else
                    myReject(result.userMessage);
            },
            error: function (err) {
                myReject(err);
            }
        });
    });

}


