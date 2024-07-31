(function(define) {
    define(function(require) {
        var HiloXml = {
            styleXml:function()
            {
                return "<style>.xat,.xel{font-weight:700}.xtb{display:table;font-family:monospace}.xtc{display:table-cell}.xat,.xdt,.xel,.xmt{display:inline}.xmt{color:#00c}.xel{color:#0d6efd}.xdt{color:#000}.xat{color:#dc3545}</style>";
            },
            view: function(xml)
            {                
                var $modal = HiloModal.showAlertWithFrame();
                HiloModal.addButtonFooter($modal,"Tải xuống").off("click").on("click",function(){
                    HiloFile.downloadXmlFile(xml);
                });
                $("body").append($modal);
                var $iframe = $modal.find("iframe");
                var iframe = $iframe[0];
                iframe.wi
                var doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(HiloXml.styleXml());
                doc.write(HiloStringUtils.convertXmlToHtml(xml));
                doc.close();
                $iframe.on('load', function() {
                    console.log($(doc).height())
                    $iframe.height();
                 });
                HiloModal.show($modal);

            },
            show: function($modal)
            {
            },
            init: function()
            {                
                jQuery.fn.extend({
                    viewXml: function (e)
                    {
                        $(this).find("[download-xml]").off("click").on("click", function (e) {
                            $this = $(this);
                            var download = $this.attr("download-xml");
                            var downloadOption = ($this.attr("download-xml-option")||"").toUpperCase();
                            var downloadTypeMethod = $this.attr("download-xml-method") ||"GET";
                            var downloadTypeFile = $this.attr("download-xml-type");
                            var downloadFileName = $this.attr("download-xml-name");
                            switch (downloadOption) {
                                case "URL":
                                    HiloFile.downloadFileOnline(download,downloadTypeMethod)
                                    .then(value => HiloXml.view(value));
                    
                                    break;
                                case "REFERENCE":
                                    HiloXml.view($(download).val())
                                    break;
                                case "SELF":
                                    HiloXml.view($this.val())
                                    break;
                            }
                        })
                    }
                })
                $(document).viewXml();
                return HiloXml;
            }
        };

        return HiloXml.init();
    });
})(typeof define === 'function' && define.amd ? define : function(factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        window.HiloXml = factory(window.jQuery);
    }
});