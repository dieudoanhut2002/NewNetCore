function ShowResponse(XmlReceiveTN) {
    var modalIframe = $('#modal-show-template-body')[0];
    var iframeDoc = modalIframe.contentDocument || modalIframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write("<style>.xat,.xel{font-weight:700}.xtb{display:table;font-family:monospace}.xtc{display:table-cell}.xat,.xdt,.xel,.xmt{display:inline}.xmt{color:#00c}.xel{color:#0d6efd}.xdt{color:#000}.xat{color:#dc3545}</style>");
    iframeDoc.write(formatXml(XmlReceiveTN));
    iframeDoc.close();

    //Tự động set chiều rộng, chiều cao cho phù hợp với kích thước mẫu
    var adjustIframeWidth = function () {
        $(modalIframe).height($(iframeDoc).height());
    };
    $(modalIframe).on('load', adjustIframeWidth);

    $("#modal-show-template").modal("show");
};

function downloadText(mytext,type = "data:text/plain;charset=utf-8,", filename = "Download") {
    var a = document.createElement("a"); //Create <a>
    a.href = type + encodeURIComponent(mytext); //Image Base64 Goes here
    a.download = filename; //File name Here
    a.click();
}

$("[show-xml]").click(function (e) {
    var id = $(this).attr("show-xml");
    console.log(id);
    ShowResponse($(`#${id}`).val());
})
$("[download-xml]").click(function (e) {
    var id = $(this).attr("download-xml");
    console.log(id);
    downloadText($(`#${id}`).val(), "data:application/xml;charset=utf-8,","Download.xml");
})



