
(function (define) {
    define(function (require) {
        var HiloStringUtils = {
            Empty: "",
            convertXmlToHtml(xml, colorize = true, indent = undefined)
            {
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
            },
            toUpper: function (text) {
                return text?.toUpperCase() ?? HiloStringUtils.Empty;
            },
            toUpperFirstCase: function (text) {
                return HiloStringUtils.isNullOrWhiteSpace(text) ? HiloStringUtils.Empty : HiloStringUtils.toUpper(text.charAt(0)) + HiloStringUtils.toLower(text.slice(1))
            },
            toUpperFirstCaseMuti: function (text) {
                if (HiloStringUtils.isNullOrWhiteSpace(text)) return HiloStringUtils.Empty;
                var result = text;
                var _arrays = ["."];
                _arrays.forEach(function (item, index) {
                    result = HiloStringUtils.split(result, item).filter(p => !HiloStringUtils.isNullOrWhiteSpace(p)).map(p => HiloStringUtils.toUpperFirstCase(p)).join("\n.");
                })
                return result;
            },
            createCode: function (text) {
                var result = text;
                var _arrays = ["_", " "];
                _arrays.forEach(function (item, index) {
                    result = HiloStringUtils.split(result, item).filter(p => !HiloStringUtils.isNullOrWhiteSpace(p)).map(p => HiloStringUtils.toUpper(HiloStringUtils.replaceUnicode(p[0]))).join("");
                })
                return result;
            },
            toLower: function (text) {
                return text?.toLowerCase() ?? HiloStringUtils.Empty;
            },
            isValueSelect: function (text) {
                return !HiloStringUtils.isNullOrWhiteSpace(text) && !HiloStringUtils.isDefaultGuid(text)
            },
            isDefaultGuid: function (text) {
                return text == "00000000-0000-0000-0000-000000000000" || text == "00000000000000000000000000000000"
            },
            isNull: function (text) {
                return !(text);
            },
            isNullOrEmpty: function (text) {
                return HiloStringUtils.isNull(text) || text.length == 0;
            },
            isNullOrWhiteSpace: function (text) {
                return HiloStringUtils.isNullOrEmpty(text) || text.trim().length == 0;
            },
            split: function (text, charSplit) {
                if (HiloStringUtils.isNullOrWhiteSpace(text)) return [];
                return text.split(charSplit)
            },
            splitEmpty: function (text, charSplit) {
                return text.split(charSplit).filter(function (p) { return !HiloStringUtils.isNullOrEmpty(p) });
            },
            splitEmptyAndSpace: function (text, charSplit) {
                return text.split(charSplit).filter(function (p) { return !HiloStringUtils.isNullOrWhiteSpace(p) });
            },
            trim: function (text) {
                return text?.trim() ?? HiloStringUtils.Empty;
            },
            trimAll: function (text) {
                if (HiloStringUtils.isNullOrWhiteSpace(text)) return HiloStringUtils.Empty;
                var result = text;
                ["\t", "\r\n", "\n", " "].forEach(function (item, index) {
                    result = HiloStringUtils.split(result, item).filter(p => !HiloStringUtils.isNullOrWhiteSpace(p)).map(p => p).join(" ");
                })
                return result;
            },
            trimHtml: function (text) {
                return text?.replaceAll("> <", "><") ?? HiloStringUtils.Empty;
            },
            replaceUnicode: function (text) {
                return HiloStringUtils.isNullOrWhiteSpace(text) ? HiloStringUtils.Empty : text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('Đ', 'D').replaceAll('đ', 'd');
            },
            keyAutoResize: function (text) {
                return `hilo-auto-${text}-resize`;
            },
            getTypeFile: function (text) {
                switch (HiloStringUtils.toUpper(text)) {
                    case ".XSLT":
                    case ".XML": return "data:text/xml;charset=utf-8,";
                    case ".TXT": return "data:text/plain;charset=utf-8,";
                    case ".PDF": return "data:application/pdf;base64,"
                    default: return "data:text/plain;charset=utf-8,";
                }
            },
            downloadText: function (text, type = "data:text/plain;charset=utf-8,", filename = "Download") {
                var a = document.createElement("a"); //Create <a>
                a.href = type + encodeURIComponent(text); //Image Base64 Goes here
                a.download = `${filename}`; //File name Here
                a.click();
            },
            toBase64Png: function (text) {
                if (!text.includes("data:image/png;base64,"))
                    text = "data:image/png;base64," + text;
                return text;
            },
            newLineHtml: function (text) {
                return String(text)?.replaceAll("\n", "<br>") ?? HiloStringUtils.Empty;
            },
            createFileName: function (ext = ".txt") {
                return HiloStringUtils.append("download", String(Date.now()), ext)
            },
            format: function (text, ...arguments) {
                if (HiloStringUtils.isNullOrWhiteSpace(text)) return HiloStringUtils.Empty;
                arguments.forEach(function (item, index) {
                    text = text.replace("{" + index + "}", item)
                })
                return text;
            },
            truncate: function (text, length) {
                return text.length > length ? text.slice(0, length) : text;
            },
            append: function (text, ...arguments) {
                text = HiloStringUtils.isNullOrWhiteSpace(text) ? HiloStringUtils.Empty : text;
                arguments.forEach(function (item, index) {
                    text = text + item;
                })
                return text;
            },
            indexRow: function (text, index) {
                return text?.replace(/\[\d+\]/g, `[${index}]`)?.replace(/\_\d+\_/g, `_${index}_`) ?? "";
            },
            getFileName: function (text) {
                return text?.split('.')?.slice(0, -1)?.join('.');
            },
            toJson: function (value) {
                try {
                    return JSON.stringify(value)
                } catch {
                    return null;
                }

            },
            toObject: function (text) {
                try {
                    return JSON.parse(text)
                } catch {
                    return null;
                }

            },
            equalWithoutCace: function (leftText, rightText) {
                leftText = HiloStringUtils.isNullOrWhiteSpace(leftText) ? HiloStringUtils.Empty : HiloStringUtils.replaceUnicode(HiloStringUtils.trim(leftText));
                rightText = HiloStringUtils.isNullOrWhiteSpace(rightText) ? HiloStringUtils.Empty : HiloStringUtils.replaceUnicode(HiloStringUtils.trim(rightText));
                return HiloStringUtils.toUpper(leftText) == HiloStringUtils.toUpper(rightText);
            },
            viewTemplateResult: function (data) {
                if (!data.id) { return data.text; }
                return $("<div>").addClass("row").append($("<div>").addClass("col-12").html(HiloStringUtils.newLineHtml(String(data.display))));
            },
            md5: function (text) {
                return CryptoJS.MD5(`${text}`.toUpperCase()).toString()
            },
            init: function () {
                String.prototype.customEmpty = HiloStringUtils.Empty;
                String.prototype.customToUpper = function () { return HiloStringUtils.toUpper(this) };
                String.prototype.customToUpperFirstCase = function () { return HiloStringUtils.toUpperFirstCase(this) };
                String.prototype.customToUpperFirstCaseMuti = function () { return HiloStringUtils.toUpperFirstCaseMuti(this) };
                String.prototype.customCreateCode = function () { return HiloStringUtils.createCode(this) };
                String.prototype.customToLower = function () { return HiloStringUtils.toLower(this) };
                String.prototype.customIsValueSelect = function () { return HiloStringUtils.isValueSelect(this) };
                String.prototype.customIsDefaultGuid = function () { return HiloStringUtils.isDefaultGuid(this) };
                String.prototype.customIsNull = function () { return HiloStringUtils.isNull(this) };
                String.prototype.customIsNullOrEmpty = function () { return HiloStringUtils.isNullOrEmpty(this) };
                String.prototype.customIsNullOrWhiteSpace = function () { return HiloStringUtils.isNullOrWhiteSpace(this) };
                String.prototype.customSplit = function (charSplit) { return HiloStringUtils.split(this, charSplit) };
                String.prototype.customSplitEmpty = function (charSplit) { return HiloStringUtils.splitEmpty(this, charSplit) };
                String.prototype.customSplitEmptyAndSpace = function (charSplit) { return HiloStringUtils.splitEmptyAndSpace(this, charSplit) };
                String.prototype.customTrim = function () { return HiloStringUtils.trim(this) };
                String.prototype.customTrimAll = function () { return HiloStringUtils.trimAll(this) };
                String.prototype.customTrimHtml = function () { return HiloStringUtils.trimHtml(this) };
                String.prototype.customReplaceUnicode = function () { return HiloStringUtils.replaceUnicode(this) };
                String.prototype.customCreateFileName = function (ext = ".txt") { return HiloStringUtils.createFileName(this) };
                String.prototype.customFormat = function (...arguments) { return HiloStringUtils.format(this, arguments) };
                String.prototype.customTruncate = function (...arguments) { return HiloStringUtils.truncate(this, arguments) };
                String.prototype.customAppend = function (...arguments) { return HiloStringUtils.append(this, arguments) };
                String.prototype.customIndexRow = function (index) { return HiloStringUtils.indexRow(this, index) };
                String.prototype.customGetFileName = function () { return HiloStringUtils.getFileName(this) };
                String.prototype.customToObject = function () { return HiloStringUtils.toObject(this) };
                String.prototype.customEqualWithoutCace = function (rightText) { return HiloStringUtils.equalWithoutCace(this, rightText) };
                return this;
            }

        };

        return HiloStringUtils.init();
    });
})(typeof define === 'function' && define.amd ? define : function (factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        window.HiloStringUtils = factory(window.jQuery);
    }
});