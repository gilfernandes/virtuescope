

var loaderSupport = (function() {

    var pub = {};

    pub.loadFile = function (filename) {
        if (filename.match(/.+\.js/i)) {
            this.loadJsCssfile(filename, "js");
        }
        else if (filename.match(/.+\.css/i)) {
            this.loadJsCssfile(filename, "css");
        }
    };

    pub.loadJsCssfile = function (filename, filetype) {
        var fileref;
        if (filetype === "js") { //if filename is a external JavaScript file
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
        }
        else if (filetype === "css") { //if filename is an external CSS file
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref !== "undefined") {
            var length = document.getElementsByTagName("head").length;
            document.getElementsByTagName("head")[length - 1].appendChild(fileref);
        }
    };

    pub.checkReadyOther = function (other, callback) {
        if (window[other]) {
            callback();
        }
        else {
            window.setTimeout(function () {
                pub.checkReadyOther(other, callback);
            }, 300);
        }
    };

    return pub;
}());