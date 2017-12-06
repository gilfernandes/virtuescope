/**
 * Utility package.
 * @type type
 */
var util = {
    isIE: function() {
        return ((navigator.appName === 'Microsoft Internet Explorer') ||
                ((navigator.appName === 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
    },
    pad: function(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },
    ellipsis: function(text, length) {
        let textLength = text.length;
        if (textLength > length) {
            text = text.substring(0, length);
            if (text.charAt(text.length - 1 !== ' ') && length > 10) {
                // Find the last existing space
                let limit = length;
                for (let i = length; i > length - 10; i--) {
                    let curChar = text.charAt(i);
                    if (curChar === ' ') {
                        limit = i;
                        break;
                    }
                }
                text = text.substring(0, limit);
            }
            text += " ...";
        }
        return text;
    },
    readParam: function readParam(paramName) {
        var regex = new RegExp(paramName + "\=([^\&]+)", 'gi');
        var res = regex.exec(location.href);
        if (res !== null && res.length > 1) {
            return decodeURI(res[1]);
        }
        return "";
    },
    // Poll for jQuery to come into existance
    checkReadyJQuery: function(callback) {
        if (window.jQuery && window.jQuery.cookie) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() {
                util.checkReadyJQuery(callback);
            }, 100);
        }
    },
    // Replace a jQuery class with another one.
    replaceClass: function(jQueryElement, removePatternStr, addClass) {
        const regex = new RegExp(removePatternStr, "g");
        jQueryElement.removeClass(function (index, className) {
            return className.split(" ").filter(function (clazz) {
                return clazz.match(regex);
            }).reduce(function (a, s) {
                return a + " " + s
            }, "");
        }).addClass(addClass);
    }
};