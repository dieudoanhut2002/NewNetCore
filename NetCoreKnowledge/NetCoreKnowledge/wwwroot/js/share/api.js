

    (function (define) {
        define(function (require) {
            var HiloApi = {
                Lock: false,
                Key: null,
                convertJson:function(data)
                {
                    try
                    {
                        return JSON.parse(data);
                    }
                    catch
                    {
                        return undefined
                    }
                },
                apiLock: function () {
                    if (HiloApi.Lock) return false;
                    HiloApi.Lock = true;
                    return true;
                },
                apiUnLock: function () {
                    HiloApi.Lock = false;
                },
                fakeBody: function (status) {
                    var $divTitle = $("<div>").addClass("text-danger h1");
                    switch (status) {
                        case 404:
                            $divTitle.text("Tính năng đang phát triển");
                        case 400:
                            $divTitle.text("Hệ thống đang bảo trì vui lòng thử lại sau ít phút");
                        default:
                            $divTitle.text("Tính năng đang phát triển");
                    }
                    return $("<div>").append($("<div>").addClass("show-ie d-flex flex-column min-vh-100 justify-content-center align-items-center bg-light").append($divTitle)).html();
                },
                showLoading: function () {
                    if ($("#loader-wrapper:not([disable-auto-loadding])").attr('hidden') !== undefined)
                        $("#loader-wrapper:not([disable-auto-loadding])").removeAttr("hidden");
                    if ($("#loader-v2-wrapper:not([disable-auto-loadding])").attr('hidden') !== undefined)
                        $("#loader-v2-wrapper:not([disable-auto-loadding])").removeAttr("hidden");
                },
                hideLoading: function () {
                    if (!($("#loader-wrapper:not([disable-auto-loadding])").attr('hidden') !== undefined))
                        $("#loader-wrapper:not([disable-auto-loadding])").attr('hidden', 'hidden');
                    if (!($("#loader-v2-wrapper:not([disable-auto-loadding])").attr('hidden') !== undefined))
                        $("#loader-v2-wrapper:not([disable-auto-loadding])").attr('hidden', 'hidden');
                },
                createKeyCache: function (url, data) {
                    return `cache-response-${url}${JSON.stringify(data)}`
                },
                removeCache: function (url, data) {
                    return HiloStore.deleteIndexedDB(HiloApi.createKeyCache(url, data));
                },
                getCacheApi: function (key) {
                    return new Promise((resolve, reject) => {
                        HiloStore.selectIndexedDB(key).then(response => {
                            resolve(response);
                        })
                    })
                },
                addCacheApi: function (key, data, time) {
                    return new Promise((resolve, reject) => {
                        HiloStore.insertIndexedDB(key, data, time).then(response => {
                            resolve(response);
                        })
                    })
                },
                stopCallApi: function (data) {
                    if (data.lock)
                        HiloApi.apiUnLock();
                    if (data.showLoading)
                        HiloApi.hideLoading();
                },
                startCallApi: function (data) {
                    if (data.lock) {
                        if (!HiloApi.apiLock()) return true;
                    }
                    if (data.showLoading) {
                        HiloApi.showLoading();
                    }
                    return false;
                },
                callApi: function (data) {
                    return new Promise((resolve, reject) => {
                        if (HiloApi.startCallApi(data)) return;
                        try {
                            var request = Object.assign({}, {
                                headers: {
                                    'hilo-web-driver-header': navigator.webdriver,
                                    'hilo-web-key-header': HiloApi.Key,
                                },
                                success: function (result, textStatus, xhr) {
                                    console.log(result);
                                    console.log(xhr);
                                    console.log(textStatus);
                                    HiloApi.stopCallApi(data);
                                    console.log(xhr.status);
                                    if (data.cache && (xhr.status == 200)) {
                                        HiloApi.addCacheApi(HiloApi.createKeyCache(data.url, data.data), result, data.timecache ?? 2 * 60)
                                    }
                                    resolve(result);
                                },
                                error: function (error, xhr, textStatus) {
                                    if (data.lock)
                                        HiloApi.apiUnLock();
                                    if (data.showLoading)
                                        HiloApi.hideLoading();
                                    console.log(error);
                                    console.log(xhr);
                                    console.log(textStatus);
                                    var json = HiloApi.convertJson(error.responseText);
                                    if(json)
                                        resolve(json);
                                    if (data.cache && data.dataType == "binary" && error.status == 200)
                                    {
                                        HiloApi.addCacheApi(HiloApi.createKeyCache(data.url, data.data), error.responseText, data.timecache ?? 2 * 60);                                        
                                        resolve(error.responseText);
                                    }
                                    else
                                        reject(error.responseText)
                                }
                            }, data);
                            if (data.cache) {
                                HiloApi.getCacheApi(HiloApi.createKeyCache(data.url, data.data))
                                    .then(response => {
                                        if (response) {
                                            HiloApi.stopCallApi(data);     
                                            resolve(response);
                                        }
                                        else
                                            $.ajax(request);
                                    })
                            }
                            else
                                $.ajax(request);
                        } 
                        catch(err) 
                        {
                            console.log(err);
                            reject(null)

                        }
                    })
                },
                callApiLock: function (data) {
                    data.lock = true;
                    return HiloApi.callApi(data);
                },
                callApiLoadding: function (data) {
                    data.showLoading = true;
                    return HiloApi.callApi(data);
                },
                callApiLockLoadding: function (data) {
                    data.lock = true;
                    data.showLoading = true;
                    return HiloApi.callApi(data);
                }
            };

            return HiloApi;
        });
    })(typeof define === 'function' && define.amd ? define : function (factory) {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = factory(require('jquery'));
        } else {
            window.HiloApi = factory(window.jQuery);
        }
    });