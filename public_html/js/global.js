/*
 * Brahma Kumaris 2016
 */
var global = {
    urls: {
        domain: location.href.indexOf("localhost") > -1 ? "http://localhost:" + location.port : "http://31.6.78.120",
        context: location.href.indexOf("localhost") > -1 ? "/virtuescope.server/HTML5Application/public_html" : "/virtuescope2/vs",
        extraContext: location.href.replace(/.+?:(\d+)\/.+/, "$1") > 60000 ? "/HTML5Application" : ""
    },
    layout: {
        hideControls: false
    },
    language: "en_GB",
    css: {
        preventLoad: true
    },
    libs: {
        exclude: [] // jquery, jquery-ui
    },
    isLocal: function() {
        return location.href.indexOf("localhost") > -1;
    },
    extractPort: function() {
        return location.href.replace(/.+?:(\d+)\/.+/, "$1");
    },
    findWheelImagePath : function() {
        if(!global.isLocal()) {
            return global.urls.domain + global.urls.context + "/images/wheels/";
        }
        else {
            let port = global.extractPort();
            if(port > 60000) {
                return "http://localhost:" + port + "/virtuescope.server/HTML5Application/public_html/images/wheels";
            }
            else {
                return "http://localhost:" + port + global.urls.context + "/images/wheels/";
            }
        }
    },
    findSpinnerImage: function() {
        let actualImage = "loading.gif";
        if(!global.isLocal()) {
            return global.urls.domain + global.urls.context + "/images/icons/" + actualImage;
        }
        else {
            let port = global.extractPort();
            if(port > 60000) {
                return "http://localhost:" + port + "/virtuescope.server/HTML5Application/public_html/images/icons/" + actualImage;
            }
            else {
                return "http://localhost:" + port + global.urls.context + "/images/icons/" + actualImage;
            }
        }
    },
    useMobileVersion: function() {
        return false;
    },
    targetElement: "body"
};