/* 
 * Brahma Kumaris 2014
 */

/**
 * History related functions.
 */
var hist = {
    saveHistory: function(virtueText) {
        var history = jQuery.cookie("virtueHistory");
        if (history !== null) {
            var now = new Date();
            history += (now.getYear() + 1900) + "-" + util.pad((now.getMonth() + 1), 2, '0') + "-" + util.pad(now.getDate(), 2, '0') + " " + util.pad(now.getHours(), 2, '0')
                    + ":" + util.pad(now.getMinutes(), 2, '0') + "::" + virtueText + "\n";
            jQuery.cookie("virtueHistory", history);
        }
        else {
            jQuery.cookie("virtueHistory", new Date() + "::" + virtueText + "\n");
        }
        return false;
    },
    renderHistory: function() {
        var history = jQuery.cookie("virtueHistory");
        var $showHist = jQuery("#showHist");
        if ($showHist.html().indexOf(i18n["Hide"]) > -1) {
            jQuery("#history").html("");
            $showHist.html(i18n["Show history"]);
        }
        else if (history) {
            var lines = history.split("\n");
            var historyArray = [];
            for (var i = 0, length = lines.length; i < length; i++) {
                var elems = lines[i].split("::");
                if (typeof (elems[1]) != "undefined") {
                    historyArray[historyArray.length] = [elems[0], elems[1]];
                }
            }
            jQuery("#history").html("<table id='histTable' class='display' cellspacing='0' width='100%'></table>");
            jQuery('#histTable').dataTable({
                "data": historyArray,
                "columns": [
                    {"title": i18n["Date"]},
                    {"title": i18n["Virtue"]}
                ]
            });
            $showHist.html(i18n["Hide history"]);
        }
        else {
            jQuery("#history").html(i18n["No history yet"]);
        }
        return false;
    },
    deleteHistory: function() {
        jQuery.cookie("virtueHistory", "");
        jQuery("#history").html("");
        return false;
    }
};


