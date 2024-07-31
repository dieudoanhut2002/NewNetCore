$(document).ready(function () {
    FillSelect2();
});

$('#invTypeSelect').on('change', function () {
    $("#invTemplateForm").empty().trigger("change");
    FillSelect2();
});

function FillSelect2() {
    $('#invTemplateForm').select2('destroy');
    $('#invTemplateForm').select2({
        placeholder: 'Chọn mẫu hóa đơn bằng nhập từ khóa',
        theme: 'bootstrap-5',
        ajax: {
            url: '/InvRange/GetInvTemplate',
            dataType: 'json',
            delay: 250,
            type: 'GET',
            data: function (params) {
                var query = {
                    InvType: $("#invTypeSelect").val(),
                    Name: params.term
                }
                return query;
            },
            processResults: function (data) {
                return {
                    results: $.map(data.data.items, function (obj) {
                        obj.id = obj.id || obj.pk; // replace pk with your identifier
                        obj.text = obj.name; // replace name with the property used for the text
                        return obj;
                    })
                };
            }
        }
    });
}

//function ShowInvTemplate() {
//    var invTemplateID = $('.invTemplateSelect').val();
//    var invRangeId = $('#invRangeId').val();
//    var url = `/InvTemplate/GetHtml?InvTemplateID=${invTemplateID}`;
//    if (invRangeId !== null && invRangeId !== "" && typeof (invRangeId) != 'undefined') {
//        url += `&InvRangeID=${invRangeId}`;
//    }

//    if (invTemplateID !== null && invTemplateID !== ""){
//        console.log("not null");
//        CallAjax("GET", url, null, function (rp) {
//            var modalIframe = $('#modal-show-template-body')[0];
//            var iframeDoc = modalIframe.contentDocument || modalIframe.contentWindow.document;
//            iframeDoc.open();
//            iframeDoc.write(rp.data);
//            iframeDoc.close();

//            //Tự động set chiều rộng, chiều cao cho phù hợp với kích thước mẫu
//            var adjustIframeWidth = function () {
//                $(modalIframe).width($(iframeDoc).width());
//                $(modalIframe).height($(iframeDoc).height());
//            };
//            $(modalIframe).on('load', adjustIframeWidth);

//            $("#modal-show-template").modal("show");
//        })
//    }
//    console.log(element);
//}