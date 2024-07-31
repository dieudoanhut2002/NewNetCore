async function ShowTOInvError(ID) {
    CallAjax("GET", `/TOInvError/GetHtml?ID=${ID}`, null, function (rp) {
        var modalIframe = $('#modal-show-toinverror-body')[0];
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

        $("#modal-show-toinverror").modal("show");
    });
}
$(document).ready(function () {
    $("#printTOInvError").click(function () {
        $("#modal-show-toinverror-body").get(0).contentWindow.print();
    });
});



