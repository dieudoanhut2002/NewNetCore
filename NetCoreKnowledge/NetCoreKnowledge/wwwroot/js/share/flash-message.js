

(function (define) {
    define(function (require) {
        var FlashMessage = {
            createToastContainer: function()
            {
                var $Container = $("body").find(".ToastContainer");
                if($Container.length == 0)
                {
                    $Container = $("<div>")
                    .addClass("ToastContainer")
                    .addClass("toast-container")
                    .addClass("position-fixed")
                    .addClass("top-0")
                    .addClass("end-0")
                    .addClass("p-3");
                    $("body").append($Container);
                }
                return $Container;
            },
            showInfo: function(message)
            {
                FlashMessage.showToastMessage(message,"info")
            },
            showSuccess: function(message)
            {
                FlashMessage.showToastMessage(message,"success")
            },
            showSuccess: function(message)
            {
                FlashMessage.showToastMessage(message,"warning")
            },
            showError: function(message)
            {
                FlashMessage.showToastMessage(message,"error")
            },
            createToast: function(message,clazz,title)
            {                
                var toastHtml = $('<div>')
                    .addClass('toast')
                    .addClass('b')
                    .addClass('align-items-center')
                    .addClass('text-white')
                    .addClass(clazz)
                    .attr('role', 'alert')
                    .attr('aria-live', 'assertive')
                    .attr('aria-atomic', 'true')
                    .append(
                        $('<div>')
                            .addClass(`toast-header text-white  ${clazz}`)
                            .append(
                                $('<strong>')
                                    .addClass('me-auto')
                                    .text(title),
                                $('<button>')
                                    .attr('type', 'button')
                                    .addClass('btn-close btn-close-white')
                                    .attr('data-bs-dismiss', 'toast')
                                    .attr('aria-label', 'Close')
                            ),
                        $('<div>')
                            .addClass(`toast-body ${clazz}`)
                            .text(message)
                    );
                return toastHtml;
            },
            showToastMessage: function (message, type = "error") {
                console.log(message, type);
                var title = "Lỗi";
                var clazz = "bg-danger";
                switch (type) {
                    case "info":
                        title = "Thông tin";
                        clazz = "bg-info";
                        break;
                    case "success":
                        title = "Thông báo";
                        clazz = "bg-primary";
                        break;
                    case "warning":
                        title = "Cảnh báo";
                        clazz = "bg-warning";
                        break;
                    default:
                        break;
                }
                var toastHtml = FlashMessage.createToast(message,clazz,title);
                FlashMessage.createToastContainer().append(toastHtml);
                toastHtml
                .on("hidden.bs.toast", function (e) {
                    $(this).remove();
                });
                toastHtml.toast("show")
            },
            init: function(){
                $("flashmessage div").each(function (index, element) {
                    var $element = $(element);
                    var flashMessage = $element.attr("flash-message");
                    var flashMessageType = $element.attr("flash-message-type");
                    FlashMessage.showToastMessage(flashMessage, flashMessageType);
                })
                return FlashMessage;
            }
        };

        return FlashMessage.init();
    });
})(typeof define === 'function' && define.amd ? define : function (factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        window.FlashMessage = factory(window.jQuery);
    }
});