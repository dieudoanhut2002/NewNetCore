async function ShowInvXml(ID) {
    CallAjax("GET", `/TODeclarationForm01/GetXml?ID=${ID}`, null, function (rp) {
        var modalIframe = $('#modal-show-xml-body')[0];
        var iframeDoc = modalIframe.contentDocument || modalIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write("<style>.xat,.xel{font-weight:700}.xtb{display:table;font-family:monospace}.xtc{display:table-cell}.xat,.xdt,.xel,.xmt{display:inline}.xmt{color:#00c}.xel{color:#0d6efd}.xdt{color:#000}.xat{color:#dc3545}</style>");
        iframeDoc.write(formatXml(rp.data));
        iframeDoc.close();

        //Tự động set chiều rộng, chiều cao cho phù hợp với kích thước mẫu
        var adjustIframeWidth = function () {
            $(modalIframe).height($(iframeDoc).height());
        };
        $(modalIframe).on('load', adjustIframeWidth);

        $('#downloadXml').off('click').on('click', function () {
            var data = rp.data;
            downloadData(data, "ToKhai.xml", "application/xml");
        });

        $("#modal-show-xml").modal("show");
    });
}

function downloadData(data, filename = "Download.xml", mimeType = "application/xml") {
    var blob = new Blob([data], { type: mimeType });

    var downloadUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
    }, 100);
}


$('#downloadText').off('click').on('click', function () {
    var data = "Đây là một số dữ liệu text để tải xuống";
    downloadData(data, "Download.txt", "text/plain");
});

async function ShowToDeclarationForm01Template(ID) {
    CallAjax("GET", `/TODeclarationForm01/GetHtml?ID=${ID}`, null, function (rp) {
        var modalIframe = $('#modal-show-template-body')[0];
        var iframeDoc = modalIframe.contentDocument || modalIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(rp.data);
        iframeDoc.close();

        //Tự động set chiều rộng, chiều cao cho phù hợp với kích thước mẫu
        var adjustIframeWidth = function () {
            $(modalIframe).height($(iframeDoc).height());
        };
        $(modalIframe).on('load', adjustIframeWidth);

        $('#downloadHtml').off('click').on('click', function () {
            CallAjaxFile("GET", `/TODeclarationForm01/GetPdf?ID=${ID}`, null, function (xhr, status, error) {
                if (xhr.data) {

                }
                else {
                    downloadData(xhr, "ToKhai.pdf", 'application/pdf');
                }
            });
        });


        $("#modal-show-template").modal("show");
    });
}
