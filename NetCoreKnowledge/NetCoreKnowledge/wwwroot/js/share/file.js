


(function (define) {
    define(function (require) {
        var HiloFile = {
            downloadFile: function (data,filename = "Download.txt", type = "text/plain")
            {
                // Tạo một blob từ nội dung của tệp
                var blob = new Blob([data], { type: type });
                // Tạo một liên kết tải xuống
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                // Kích hoạt tải xuống
                link.click();
            },
            downloadXmlFile: function (data,filename = "Download.xml") {
                HiloFile.downloadFile(data,filename, "application/xml")
            },
            downloadPdfFile: function (data,filename = "Download.pdf") {
                HiloFile.downloadFile(data,filename, "application/pdf")
            },
            downloadFileOnline:function (download,type="GET") {
                
                return new Promise((resolve, reject) => {
                    HiloApi.callApi({
                    type:type,
                    url:download,
                    dataType:"binary",
                    cache:true,
                    timecache: 12*30*24*60*60
                    })
                    .then(value => {
                        resolve(value);
                    })
                    .catch(error => {
                        FlashMessage.showError(error);
                    })
                    ;
                });
            },
            init: function()
            {                
                    jQuery.fn.extend({
                        downloadFile: function (e)
                        {
                            $(this).find("[download-file]").off("click").on("click", function (e) {
                                $this = $(this);
                                var download = $this.attr("download-file");
                                var downloadOption = ($this.attr("download-file-option")||"").toUpperCase();
                                var downloadTypeMethod = $this.attr("download-file-method") ||"GET";
                                var downloadTypeFile = $this.attr("download-file-type");
                                var downloadFileName = $this.attr("download-file-name");
                                switch (downloadOption) {
                                    case "URL":
                                        HiloFile.downloadFileOnline(download,downloadTypeMethod)
                                            .then(value => HiloFile.downloadFile(value,downloadFileName, downloadTypeFile))
                                        ;
                                        break;
                                    case "REFERENCE":
                                        HiloFile.downloadFile($(download).val(),downloadFileName, downloadTypeFile)
                                        break;
                                    case "SELF":
                                        HiloFile.downloadFile($this.val(),downloadFileName, downloadTypeFile)
                                        break;
                                }
                            })
                        }
                    })
                  $(document).downloadFile();
                 return HiloFile;
            }
        };

        return HiloFile.init();
    });
})(typeof define === 'function' && define.amd ? define : function (factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        window.HiloFile = factory(window.jQuery);
    }
});



