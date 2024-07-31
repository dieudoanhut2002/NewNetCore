
//function changeStatus(ID, element) {
//    CallAjax("POST", `/InvRange/UpdateStatus?ID=${ID}&status=${element.value}`, null, function (response) {
//        if (response.status !== true) {
//            if (typeof response.responseJSON === "undefined") {
//                ShowToastError("Lỗi", "Có lỗi không mong muốn xảy ra, vui lòng thử lại sau");
//            }
//            else {
//                ShowToastError("Lỗi", response.userMessage);
//            }
//        }
//        else {
//            ShowToastSuccess("Thành công", response.userMessage);
//        }
//    })
//}
function ShowInvTemplate(ID) {
    var url = `/InvTemplate/GetHtml?InvRangeID=${ID}`;
    CallAjax("GET", url, null, function (rp) {
        var modalIframe = $('#modal-show-template-body')[0];
        var iframeDoc = modalIframe.contentDocument || modalIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(rp.data);
        iframeDoc.close();

        //Tự động set chiều rộng, chiều cao cho phù hợp với kích thước mẫu
        var adjustIframeWidth = function () {
            /*$(modalIframe).width($(iframeDoc).width());*/
            $(modalIframe).height($(iframeDoc).height());
        };
        $(modalIframe).on('load', adjustIframeWidth);

        $("#modal-show-template").modal("show");
    })
}