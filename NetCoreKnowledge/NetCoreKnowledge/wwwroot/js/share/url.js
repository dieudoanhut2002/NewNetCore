(function (define) {
    define(function (require) {
        var HiloUrl = {
            DefaultController: "Home",
            DefaultAction: "Index",
            AreaSupport: [
                "ROOT",
                "ADMIN",
                "MANAGER",
                "GUEST",
            ],
            createUrl: function (area, controller, action, search) {
                var uri = `${location.origin}`;
                var chckArea = HiloUrl.AreaSupport.filter(value => area.toUpperCase() == value.toUpperCase());
                if (chckArea.length != 0) {
                    uri = `${uri}/${area}/${controller}/${action}${search}`;
                }
                else {
                    uri = `${uri}/${controller}/${action}${search}`;
                }
                return uri;
            },
            getParams: function (queryString) {
                queryString = queryString ? queryString.split('?')[1] : queryString;
                var obj = {};
                if (queryString) {
                    queryString = queryString.split('#')[0];
                    var arr = queryString.split('&');

                    for (var i = 0; i < arr.length; i++) {
                        var a = arr[i].split('=');
                        var paramName = a[0];
                        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
                        paramName = paramName.toLowerCase();
                        if (typeof paramValue === 'string') paramValue = paramValue;
                        if (paramName.match(/\[(\d+)?\]$/)) {
                            var key = paramName.replace(/\[(\d+)?\]/, '');
                            if (!obj[key]) obj[key] = [];
                            if (paramName.match(/\[\d+\]$/)) {
                                var index = /\[(\d+)\]/.exec(paramName)[1];
                                obj[key][index] = paramValue;
                            } else {
                                obj[key].push(paramValue);
                            }
                        } else {
                            if (!obj[paramName]) {
                                obj[paramName] = paramValue;
                            } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                                obj[paramName] = [obj[paramName]];
                                obj[paramName].push(paramValue);
                            } else {
                                obj[paramName].push(paramValue);
                            }
                        }
                    }
                }

                return obj;
            },
            getInfo: function (uri) {

                try {
                    if (uri.indexOf(location.origin) < 0)
                        uri = `${location.origin}/${uri}`;
                    var data = new URL(uri);
                    var path = data.pathname;
                    var paths = HiloStringUtils.splitEmptyAndSpace(HiloStringUtils.trimAll(path),"/");
                    var area = "";
                    var controller =  paths[0] || HiloUrl.DefaultController;
                    var action = HiloUrl.DefaultAction;
                    var currentUrl = "";
                    var chckArea = HiloUrl.AreaSupport.filter(value => HiloStringUtils.toUpper(controller) == HiloStringUtils.toUpper(value));
                    var fullCurrentUrl = `${data.protocol}//${data.host}`;
                    if (chckArea.length != 0) {
                        area = controller;
                        controller = paths[1] || HiloUrl.DefaultController;
                        action = paths[2] || HiloUrl.DefaultAction;
                        currentUrl = `/${area}/${controller}/${action}`;
                        fullCurrentUrl = `${fullCurrentUrl}/${area}`;
                    }
                    else {
                        action = paths[1] || HiloUrl.DefaultAction;
                        currentUrl = `/${controller}/${action}`;
                    }
                    var fullUrl = `${data.protocol}//${data.host}${currentUrl}`;
                    return {
                        area: area,
                        controller: controller,
                        action: action,
                        currentUrl: currentUrl,
                        protocol: location.protocol,
                        host: location.host,
                        origin: location.origin,
                        fullUrl: fullUrl,
                        search: data.search,
                        currentUrlWithParamsUrl: `${currentUrl}${data.search}`,
                        fullCurrentWithParamsUrl: `${fullUrl}${data.search}`,
                        fullCurrentUrl: fullCurrentUrl,
                        hash: HiloStringUtils.md5(`/${controller}/${action}`),
                        params: HiloUrl.getParams(data.search),
                    };
                } catch (e) {
                    console.log(e);
                }
            },
            getInfoCurrent: function () {
                return this.getInfo(location.href);
            },
            getInfoWithArea: function (uri) {
                var _getInfo = HiloUrl.getInfo(uri);
                var _getInfoCurrent = HiloUrl.getInfoCurrent();
                if (_getInfo.area.toUpperCase() != _getInfoCurrent.area.toUpperCase()) {
                    uri = HiloUrl.createUrl(_getInfoCurrent.area, _getInfo.controller, _getInfo.action, _getInfo.search);
                }
                return this.getInfo(uri);
            },
        };
        return HiloUrl;
    });
})(typeof define === 'function' && define.amd ? define : function (factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        window.HiloUrl = factory(window.jQuery);
    }
});