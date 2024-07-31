
function callApi(params) {
    return new Promise((resolve, reject) => {
        params.success = function (response) {
            //console.log(response);
            resolve(response);
        };
        params.failure = function (response) {
            //console.log(response);
            resolve({});
        };
        params.error = function (response) {
            resolve({});
        }

        $.ajax(params);
    })
}

async function ShowInvTemplate(ID) {
    CallAjax("GET", `/InvVAT/GetHtml?ID=${ID}`, null, function (rp) {
        var modalIframe = $('#modal-show-template-body')[0];
        var iframeDoc = modalIframe.contentDocument || modalIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(rp.data.htmls[0]);
        iframeDoc.close();

        //Tự động set chiều rộng, chiều cao cho phù hợp với kích thước mẫu
        var adjustIframeWidth = function () {
            $(modalIframe).width($(iframeDoc).width());
            $(modalIframe).height($(iframeDoc).height());
        };
        $(modalIframe).on('load', adjustIframeWidth);

        $('#downloadPdfInv').off('click').on('click', function () {
            CallAjaxFile("GET", `/InvVAT/GetPdf?ID=${ID}`, null, function (xhr, status, error) {
                if (xhr.data) {

                }
                else {
                    var FileName = $("#companyTaxCode").val() + "_" + $(".serialNo").val();
                    downloadData(xhr, FileName, 'application/pdf');
                }
            });
        });

        $('#downloadXmlInv').off('click').on('click', function () {
            DowloadXml(ID);
        });

        $("#modal-show-template").modal("show");
    });
}

async function DowloadXml(ID) {
    CallAjax("GET", `/InvVAT/GetXml?ID=${ID}`, null, function (rp) {
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
        var FileName = $("#companyTaxCode").val() + "_" + $(".serialNo").val();
        downloadData(rp.data, FileName, 'application/xml');
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


$('#searchSerial').change(function () {
    var selectedInvRangeID = $(this).val();
    $('#createNewButton').attr('href', '/InvVAT/Create?InvRangeID=' + selectedInvRangeID);
});
//Tách ra hàm dùng chung
$(document).ready(function () {
    $('*')
        .decimalMaskForInput();
    $('*').initSelect2Default()
        .then(() => {
            $("*").addSelect2();
            $('#searchSerial').trigger("change");
        })
    $("#printTemplate").click(function () {
        $("#modal-show-template-body").get(0).contentWindow.print();
    });
});

//========================================Hiển thị kiểu date nhưng khi submit thì gửi kiểu date-time
$('input[type="datetime-local"].date-only').each(function () {
    var $input = $(this);
    var value = $input.val();

    if (value) {
        var datePart = value.split('T')[0];
        $input.val(datePart + 'T00:00');
    }
});

function checkAll() {
    if ($('#ckbAll').is(':checked')) {
        $('.checker span').addClass('checked');
        $('input[name=cbid]').prop('checked', true);
        $('button[name=btnDeleteInvoice]').prop('hidden', false);
    } else {
        $('input[name=cbid]').prop('checked', false);
        $('.checker span').removeClass('checked');
        $('input[name=cbid]').prop('checked', true);
        $('button[name=btnDeleteInvoice]').prop('hidden', true);
    }
}

