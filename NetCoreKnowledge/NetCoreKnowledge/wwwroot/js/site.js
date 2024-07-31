/**
 * Hàm tái sử dụng cho call Ajax
 * @param {any} type Method HTTP Request
 * @param {any} url Đường dẫn thực hiện call AJax
 * @param {any} objData 
 * @param {any} callback
 */
function CallAjax(type, url, objData, callback) {
    $.ajax({
        type: type,
        url: url,
        data: objData,
        processData: false,
        contentType: false,
        success: function (response) {
            callback(response);
        },
        failure: function (response) {
            if (response.status !== 200) {
                if (typeof response.responseJSON === "undefined") {
                    ShowToastError("Lỗi", "Có lỗi không mong muốn xảy ra, vui lòng thử lại sau");
                }
                else {
                    ShowToastError("Lỗi", response.responseJSON.userMessage);
                }

            }
            else {
                callback(response);
            }
        },
        error: function (response) {
            if (response.status !== 200) {
                if (typeof response.responseJSON === "undefined") {
                    ShowToastError("Lỗi", "Có lỗi không mong muốn xảy ra, vui lòng thử lại sau");
                }
                else {
                    ShowToastError("Lỗi", response.responseJSON.userMessage);
                }
            }
            else {
                callback(response);
            }
        }
    });
};

function CallAjaxFile(type, url, objData, callback) {
    $.ajax({
        type: type,
        url: url,
        data: objData,
        xhrFields: {
            responseType: 'blob' // Để xử lý file blob
        },
        success: function (response) {
            callback(response);
        },
        failure: function (response) {
            if (response.status !== 200) {
                if (typeof response.responseJSON === "undefined") {
                    ShowToastError("Lỗi", "Có lỗi không mong muốn xảy ra, vui lòng thử lại sau");
                }
                else {
                    ShowToastError("Lỗi", response.responseJSON.userMessage);
                }

            }
            else {
                callback(response);
            }
        },
        error: function (response) {
            if (response.status !== 200) {
                if (typeof response.responseJSON === "undefined") {
                    ShowToastError("Lỗi", "Có lỗi không mong muốn xảy ra, vui lòng thử lại sau");
                }
                else {
                    ShowToastError("Lỗi", response.responseJSON.userMessage);
                }
            }
            else {
                callback(response);
            }
        }
    });
};
function CallAjaxPromise(data) {
    return new Promise(function (myResolve, myReject) {
        var request = Object.assign({}, {
            success: function (response) {
                myResolve(response);
            },
            error: function (error) {
                if (response.status !== 200) {
                    if (typeof response.responseJSON === "undefined") {
                        myReject("Có lỗi không mong muốn xảy ra, vui lòng thử lại sau");
                    }
                    else {
                        myReject(response.responseJSON.userMessage);
                    }

                }
                else {
                    myResolve(response);
                }
            }
        }, data);
        $.ajax(request);

    });

};


/**
 * Chặn gửi form submit bằng gọi ajax
 * @param {any} formId ID Form submit
 * @param {any} callback
 */
function interceptFormSubmit(formId, callback) {
    $('#' + formId).on('submit', function (event) {
        event.preventDefault();
        var method = $(this).attr('method');
        var url = $(this).attr('action');

        // Tạo một FormData object để lấy dữ liệu từ form
        var formData = new FormData(this);
        // Tạo một plain object để chứa dữ liệu
        //var data = {};
        // Lặp qua FormData để đổ dữ liệu vào plain object
        //formData.forEach(function (value, key) {
        //    data[key] = value;
        //});


        CallAjax(method, url, formData, callback)
    });
}



/**
* Hàm thực hiện hiển thị Toast thành công với nội dung truyền vào
* @param {any} Title Tiêu đề của toast
* @param {any} Body Nội dung của toast
*/
function ShowToastSuccess(Title, Body) {
    $("#ToastsInPage").find("#ToastSuccessMessegeShare").find(".title").html(Title);
    $("#ToastsInPage").find("#ToastSuccessMessegeShare").find(".body").html(Body);
    $("#ToastsInPage").find("#ToastSuccessMessegeShare").toast("show");
};
/**
 * Hàm thực hiện hiển thị Toast lỗi với nội dung truyền vào
 * @param {any} Title Tiêu đề của toast
 * @param {any} Body Nội dung của toast
 */
function ShowToastError(Title, Body) {
    $("#ToastsInPage").find("#ToastErrorMessegeShare").find(".title").html(Title);
    $("#ToastsInPage").find("#ToastErrorMessegeShare").find(".body").html(Body);
    $("#ToastsInPage").find("#ToastErrorMessegeShare").toast("show");
};


$(document).ready(function () {
    //Tự động gán chặn form submit và chuyển sang ajax
    $('form').each(function () {
        var id = $(this).attr('id');
        var urlRedirectSuccess = $(this).attr('url-redirect-success');
        if (typeof urlRedirectSuccess !== "undefined") {
            interceptFormSubmit(id, function (response) {
                if (response.status === true) {
                    window.location.href = urlRedirectSuccess;
                }
                else {
                    ShowToastError("Lỗi", response.userMessage);
                }
            });
        }
    });
});

/**
 * Hàm thực hiện sử dụng Inputmask để định dạng đầu vào của ô input với kiểu dữ liệu decimal
 * @param {any} IntegerMaxLength Số kí tự tối đa của phần nguyên(Ví dụ: 3 là 3 kí tự tối đa)
 * @param {any} DecimalMaxLength Số kí tự tối đa của phần thập phân(Ví dụ: 3 là 3 kí tự tối đa)
 * @param {any} inputElement Giá trị phần tử jQuery element cần sử dụng inputmask
 * @param {any} RadixPoint Dấu phân cách phần thập phân
 * @param {any} GroupSeparator Dấu phân cách hàng nghìn
 * @returns
 */
function DecimalMaskForInput(IntegerMaxLength, DecimalMaxLength, inputElement, RadixPoint = ".", GroupSeparator = ",") {
    var max = '';
    for (let i = 1; i <= IntegerMaxLength; i++) {
        max = max + '9';
    }
    var mask = `${RadixPoint}9{1,${DecimalMaxLength}}`;
    if (IntegerMaxLength > 3) {
        mask = `9{1,${IntegerMaxLength - 3}}9{1,3}${mask}`

    }
    else {
        if (DecimalMaxLength <= 0) {
            mask = `9{1,${IntegerMaxLength}}`;
        }
    }
    inputElement.inputmask("currency", {
        digits: DecimalMaxLength,
        min: -Number(max),
        max: Number(max),
        digitsOptional: false,
        decimalProtect: true,
        defaultValue: 0,
        radixPoint: RadixPoint,
        placeholder: "0",
        groupSeparator: GroupSeparator,
        definitions: {
            '9': {
                validator: "[0-9]",
                cardinality: 1
            }
        },
        radixFocus: true,
        autoGroup: true,
        autoUnmask: true,
        removeMaskOnSubmit: true,
        rightAlign: false,
    });
}

$(document).ready(function () {
    //Hiển thị tất cả các Toast(nếu có)
    $("#Toasts").find(".toast").each(function () {
        $(this).toast("show");
    });
})

function callApi(params) {
    return new Promise((resolve, reject) => {
        var request = Object.assign({}, {
            success: function (result) {
                resolve(result);
            },
            error: function (error) {
                reject(error);
            }
        }, params);
        $.ajax(request);
    })
}


// Hàm convert chuỗi string xml sang html để hiển thị, tải về
function formatXml(xml, colorize = true, indent = undefined) {
    function esc(s) {
        return s.replace(/[-\/&<> ]/g, function (c) {         // Escape special chars
            return c == ' ' ? '&nbsp;' : '&#' + c.charCodeAt(0) + ';';
        });
    }
    var sm = '<div class="xmt">', se = '<div class="xel">', sd = '<div class="xdt">',
        sa = '<div class="xat">', tb = '<div class="xtb">', tc = '<div class="xtc">',
        ind = indent || '  ', sz = '</div>', tz = '</div>', re = '', is = '', ib, ob, at, i;
    if (!colorize) sm = se = sd = sa = sz = '';
    xml.match(/(?<=<).*(?=>)|$/s)[0].split(/>\s*</).forEach(function (nd) {
        ob = ('<' + nd + '>').match(/^(<[!?\/]?)(.*?)([?\/]?>)$/s);             // Split outer brackets
        ib = ob[2].match(/^(.*?)>(.*)<\/(.*)$/s) || ['', ob[2], ''];            // Split inner brackets 
        at = ib[1].match(/^--.*--$|=|('|").*?\1|[^\t\n\f \/>"'=]+/g) || ['']; // Split attributes
        if (ob[1] == '</') is = is.substring(ind.length);                     // Decrease indent
        re += tb + tc + esc(is) + tz + tc + sm + esc(ob[1]) + sz + se + esc(at[0]) + sz;
        for (i = 1; i < at.length; i++) re += (at[i] == "=" ? sm + "=" + sz + sd + esc(at[++i]) : sa + ' ' + at[i]) + sz;
        re += ib[2] ? sm + esc('>') + sz + sd + esc(ib[2]) + sz + sm + esc('</') + sz + se + ib[3] + sz : '';
        re += sm + esc(ob[3]) + sz + tz + tz;
        if (ob[1] + ob[3] + ib[2] == '<>') is += ind;                             // Increase indent
    });
    return re;
}



jQuery.fn.extend({
    removeSelect2: function () {
        $(this).find("select").each(function () {
            var $this = $(this);
            try {

                if ($this.data("select2")) {
                    $this.select2('destroy');
                } else {
                    $this.removeAttr("data-select2-id").removeClass("select2-hidden-accessible");
                    $this.next("span.select2").remove();
                }
            }
            catch (err) {
                $this.removeAttr("data-select2-id").removeClass("select2-hidden-accessible");
                $this.parent().find("span.select2").remove()
                console.log(err);
            }
        });
        return this;
    },
    autoTrim() {
        $(".decimalmask").each(function () {
            var $this = $(this);
            var value = $this.val();
            var num = parseFloat(value);

            if (!isNaN(num)) {
                var decimalIndex = value.indexOf('.');

                if (decimalIndex !== -1 && decimalIndex < value.length - 1) {
                    var digitsAfterDecimal = value.length - decimalIndex - 1;
                    var formattedNumber = num.toFixed(digitsAfterDecimal > 21 ? 21 : digitsAfterDecimal);
                    $this.val(formattedNumber);
                } else {
                    $this.val(num.toFixed(0));
                }
            }
        });
        return this;
    },
    callApiSelect2Default: function () {
        var $this = $(this);
        var url = $this.attr("href");
        var type = $this.attr("typemethod") || 'POST';
        var dataType = $this.attr("dataType") || 'json';
        var classNameValueDefualt = $this.attr("defaultValueSellect");
        var $parentEl = $(this).parent();;
        var $input = $parentEl.find('.' + classNameValueDefualt);
        var valuene = $input.val();
        var valuedefault = $(this).val();
        if (valuene) {
            valuedefault = valuene;
        }
        if (valuedefault == null) {
            valuedefault = "";
        }
        return new Promise((resolve, reject) => {
            callApi({
                url: url,
                dataType: dataType,
                type: type,
                data: {
                    Id: valuedefault
                }
            }).then(value => {

                $this.empty(); // Clear options before adding new
                value.forEach((item, index) => {
                    var option = $('<option>')
                        .val(item.id)
                        .text(item.text);
                    for (let attribute of item.attributes) {
                        option.attr(attribute.key, attribute.value);
                    }
                    option.appendTo($this);

                    if (valuedefault.length != 0)
                        if (index === 0 || item.id === valuedefault) {
                            $this.val(item.id); // Set the default value
                        }
                });
                $this.trigger("select2:select");
                resolve({})
            }).catch((err) => {
                console.log(err);
                resolve({})
            })
        })
    }
    ,
    initSelect2Default: function () {
        var allOptionDefault = []
        $(this).find("select[href]").each((i, item) => {
            let $item = $(item);
            let href = $item.attr("href");
            if (href && href.length > 0) {
                if ($item.findAndFilter("option").length == 0) {
                    allOptionDefault.push($item.callApiSelect2Default());
                }
            }
        });

        return Promise.all(allOptionDefault);
    },
    addSelect2: function () {
        $(this).removeSelect2();
        $(this).find("select").each(function () {
            var $this = $(this);
            var url = $this.attr("href");
            var type = $this.attr("typemethod") || 'POST';
            var delay = parseInt($this.attr("delay") || 250);
            var dataType = $this.attr("dataType") || 'json';
            var placeholder = $this.attr("placeholder");
            var iscache = $this.attr("iscache");
            var timecache = $this.attr("timecache");
            const multiple = $this.attr("multiple") ? true : false;
            const minimumResultsForSearch = $this.hasClass("cancel-select2") ? -1 : undefined;

            $this.select2({
                theme: 'bootstrap-5',
                width: '100%',
                placeholder: placeholder,
                minimumResultsForSearch: minimumResultsForSearch,
                multiple: multiple,
                ajax: {
                    url: url,
                    dataType: dataType,
                    delay: delay,
                    type: type,
                    data: function (params) {
                        const dataRequest = JSON.parse($this.attr("data-request") ?? "{}");
                        dataRequest.KeyWord = params.term;
                        return dataRequest;
                    },
                    transport: (params, success, failure) => {
                        var KeyWord = (params.data.KeyWord ?? "").toUpperCase();
                        var option = $this.find("option");
                        if (url == undefined || (KeyWord.length == 0 && option.length > 0)) {
                            let _searchData = $this.find("option").map((index, p) => ({
                                id: p.value,
                                text: p.text,
                            })).filter((index, p) => {
                                var result = (p.text ?? "").toUpperCase().includes(KeyWord);
                                return result;
                            });

                            success(_searchData);
                        }
                        else {
                            callApi(params)
                                .then(success)
                                .catch(failure);
                        }
                    },
                    processResults: function (data) {
                        return {
                            results: $.map(data, function (obj) {
                                obj.id = obj.id;
                                obj.text = obj.text;
                                return obj;
                            })
                        };
                    }
                }
            });
        });
        return this;
    },
    referenceSelect2: function () {
        $(this).find("select[hilo-for-param][hilo-for]").each(function (index, element) {
            var $element = $(element);
            var hilo_for_select2 = $element.attr("hilo-for");
            var hilo_for_param_select2 = $element.attr("hilo-for-param");
            if (hilo_for_select2 && hilo_for_param_select2) {

                $element
                    .off("change")
                    .on("change", function () {
                        if ($element.attr("readonly")) return;
                        var $child = $(`#${hilo_for_select2}`);
                        var params = JSON.parse($child.attr("data-request") ?? "{}");
                        params[hilo_for_param_select2] = $(element).val();
                        $child.attr("data-request", JSON.stringify(params));
                    });
            }
        });
        return this;
    },
    findAndFilter: function (key) {
        return $(this).find(key).add($(this).filter(key));
    },
    addEvent: function (event, action) {
        return $(this).off(event).on(event, action);

    },
    decimalMaskForInput: function () {
        var elements = $(this).find(".decimalmask");
        elements.each((index, item) => {
            var inputElement = $(item);
            var IntegerMaxLength = parseInt(inputElement.attr("IntegerMaxLength") || 1);
            var DecimalMaxLength = parseInt(inputElement.attr("DecimalMaxLength") || 1);
            var RadixPoint = inputElement.attr("RadixPoint") || ".";
            var GroupSeparator = inputElement.attr("GroupSeparator") || ",";
            var max = '';
            for (let i = 1; i <= IntegerMaxLength; i++) {
                max = max + '9';
            }
            var mask = `${RadixPoint}9{1,${DecimalMaxLength}}`;
            if (IntegerMaxLength > 3) {
                mask = `9{1,${IntegerMaxLength - 3}}9{1,3}${mask}`

            }
            else {
                if (DecimalMaxLength <= 0) {
                    mask = `9{1,${IntegerMaxLength}}`;
                }
            }

            inputElement.inputmask("currency", {
                digits: DecimalMaxLength,
                //min: -Number(max),
                max: Number(max),
                digitsOptional: true,
                decimalProtect: true,
                defaultValue: 0,
                radixPoint: RadixPoint,
                placeholder: "0",
                groupSeparator: GroupSeparator,
                definitions: {
                    '9': {
                        validator: "[0-9]",
                        cardinality: 1
                    }
                },
                radixFocus: true,
                autoGroup: true,
                autoUnmask: true,
                removeMaskOnSubmit: true,
                rightAlign: false,
            });
        })

        return this;
    },
});
Number.prototype.GetText = function () {
    return `${parseFloat(this.toFixed(6))}`;
};
$(document).ready(() => {
    $('*').autoTrim()
        .decimalMaskForInput();
    $('*').initSelect2Default()
        .then(() => {
            $("*").addSelect2();
        })
})