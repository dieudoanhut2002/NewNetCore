(function(define) {
    define(function(require) {
        var HiloModal = {
            Modal:undefined,
            createHeader: function()
            {             
                // Tạo thẻ div modal-header
                var $modalHeader = $('<div>').addClass('modal-header');
                var $modalTitle = $('<h5>').addClass('modal-title');                
                var $closeButton = $('<button>').addClass('close')
                    .attr('type', 'button')
                    .attr('data-dismiss', 'modal')
                    .attr('tabindex', '-1')
                    .attr('aria-label', 'Close')
                    .append($('<span>').attr('aria-hidden', 'true')
                    .html("X")
                    )                        
                    .on("click",function(e)
                    {
                        HiloModal.closeModal($(this))
                    })
                    ;
                $modalHeader.append($modalTitle, $closeButton);
                return $modalHeader;
            },
            setHeader: function (modal,text="Thông báo") {

                modal.find(".modal-title").text(text);
                return modal;
            },
            closeModal:function(child){
                
                HiloModal.hide($(child).closest(".modal"));
            },
            createButton: function(text ="Tiếp tục")
            {                
                var $button = $('<button>')
                    .addClass('btn')
                    .addClass('btn-primary')
                    .attr('type', 'button')
                    .html(text)          
                    .off("click")
                    .on("click",function(){
                        HiloModal.closeModal($(this))
                    })
                    ;
                return $button;
            },
            addButtonFooter:function(modal,text="Tiếp tục")
            {
                var $button = HiloModal.createButton(text);
                modal.find(".modal-footer").append($button);
                return $button;
            },
            createContent: function()
            {
                // Tạo thẻ div modal-content
                var $modalContent = $('<div>').addClass('modal-content');
                // Gắn các thành phần vào nhau
                $modalContent.append(HiloModal.createHeader(), HiloModal.createBody(), HiloModal.createFooter());
                return $modalContent;

            },
            createBody: function()
            {
                // Tạo thẻ div modal-body
                var $modalBody = $('<div>').addClass('modal-body');
                return $modalBody;
            },
            addBody: function (modal,item) {
                modal.find(".modal-body").append(item);
                return modal;
            },
            createDialog: function()
            {
                // Tạo thẻ div modal-dialog
                var $modalDialog = $('<div>')
                    .addClass('modal-dialog')
                    .addClass('modal-dialog-centered')
                    .attr('role', 'document');
                $modalDialog.append(HiloModal.createContent());
                return $modalDialog;
            },
            createFooter: function()
            {
                // Tạo thẻ div modal-footer
                var $modalFooter = $('<div>').addClass('modal-footer');
                var $closeFooterButton = $('<button>').addClass('btn btn-secondary')
                    .attr('type', 'button')
                    .attr('data-dismiss', 'modal')
                    .text('Huỷ')
                    .on("click",function(e)
                    {
                        HiloModal.closeModal($(this))
                    })
                    ;
                $modalFooter.append($closeFooterButton);
                return $modalFooter;
            },
            createModal: function() {
                var $modal = $('<div>')
                        .addClass('modal')
                        .addClass('current-modal')
                        .addClass('fade')
                        .attr('tabindex', '-1')
                        .attr('role', 'dialog')
                        .attr('aria-labelledby', 'exampleModalCenterTitle')
                        .attr('aria-hidden', 'true');
                $modal.append(HiloModal.createDialog());
                HiloModal.hide();
                HiloModal.Modal = $modal;
                return $modal;
            },            
            showAlertDefault:function(title,content)
            {
                
                return new Promise((resolve, reject) => {
                    var $modal = HiloModal.createModal();
                    var $modalTitle = $modal.find(".modal-title");
                    $modalTitle.text(title);
                    var $modalBody = $modal.find(".modal-body");
                    $modalBody.text(content);
                    HiloModal.addButtonFooter($modal)
                    .on("click",function(){
                        resolve(true);
                    });
                    HiloModal.show($modal);
                }) 

            },
            showAlertWithFrame:function(title,content)
            {                
                var $modal = HiloModal.createModal();
                var $modalTitle = $modal.find(".modal-title");
                $modalTitle.text(title);
                var $modalBody = $modal.find(".modal-body");
                var $iframe =$('<iframe>')
                        .addClass('modal-iframe')

                $modalBody.append($iframe);
                return $modal;
            },
            hide: function($modal)
            {
                if($modal == undefined)$modal=HiloModal.Modal;
                if($modal == undefined) return;
                $modal.modal( 'hide' ).data( 'bs.modal', null );
            },
            show: function($modal)
            {
                if($modal == undefined)$modal=HiloModal.Modal;
                if($modal == undefined) return;
                $modal.modal("show");
            },
            init: function()
            {                
                
                jQuery.fn.extend({
                        hideModal:function(){
                            HiloModal.hiden(this);
                            return this;
                        },
                        showModal:function(){
                            HiloModal.show(this);
                            return this;
                        },
                        setHeaderModal: function (text = "Tiếp tục") {
                            return HiloModal.setHeader(this, text)
                        },
                        addBodyModal: function (item) {
                            return HiloModal.addBody(this, item)
                        },
                        showModalDefault:function(){
                            $("a[href][hilo-model-title],a[href][hilo-model-content]")
                            .each(function(i,item) {
                                    let $this = $(this);         
                                    let href = $this.attr("href");
                                    let title = $this.attr("hilo-model-title");
                                    let content = $this.attr("hilo-model-content");
                                    $this.off("click").on("click",function(event){                                        
                                        event.preventDefault();
                                        HiloModal.showAlertDefault(title,content)
                                        .then((value)=>
                                        {
                                            console.log(value);
                                            window.location.href = href;
                                        });  
                                    })      
                            });
                        }
                });
                $(document).showModalDefault();
                return HiloModal;
            }
        };

        return HiloModal.init();
    });
})(typeof define === 'function' && define.amd ? define : function(factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        window.HiloModal = factory(window.jQuery);
    }
});