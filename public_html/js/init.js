/*
 Brahma Kumaris 2016
 */

let rotate = anim.initRotate();
let canvas = document.getElementById('myCanvas');
let canvasTriangle = document.getElementById('triangle');
let context = new CanvasWrapper(canvas.getContext('2d'));
let contextTriangle = canvasTriangle.getContext('2d');
let imageObj = new Image();
let rectWidth = canvas.width;
let rectHeight = canvas.height;
let stopThreshhold = 0.019;
let rotation = 1000;
let stop = true;
let degrees = 0;
let modeChanged = false;

let showImagesCookie;
let useImgs;
let showPlus;
let origShowImgText;
let origShowImgTitle;

loadExtra.loadJqueryCookie();

showImagesCookie = jQuery.cookie("showImages") === "true";
useImgs = util.readParam("useImgs") === "true" || showImagesCookie;
if (useImgs) {
    jQuery("#virtuescopeContent").css("top", "40px");
}

showPlus = util.readParam("showPlus") === "true";
if (!showPlus) {
    jQuery("#showAdvanced").hide();
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

let $showImages2 = jQuery("#showImages");
origShowImgText = showImagesCookie ? i18n["Hide Images"] : $showImages2.text();
if (showImagesCookie) {
    $showImages2.text(i18n["Hide Images"]);
}
origShowImgTitle = $showImages2.attr("title");
$showImages2.click(
    function () {
        let $showImages = jQuery("#showImages");
        if (jQuery.cookie("showImages") !== "true") {
            jQuery.cookie("showImages", "true");
            $showImages.text(i18n["Hide Images"]);
            $showImages.attr("title", origShowImgTitle);
            useImgs = true;
        }
        else {
            jQuery.cookie("showImages", "false");
            $showImages.text(i18n["Show Images"]);
            $showImages.attr("title", i18n["Cards with text will be displayed."]);
            useImgs = false;
        }
        return false;
    });

context.translate(canvas.width / 2, canvas.height / 2);

const spinnerVirtuescope = (function() {
    const pub = {};

    pub.show = function() {
        jQuery("#spinner").show();
    };

    return pub;
}());

const ui = (function () {
    const pub = {};

    pub.mobileWidth = 800;

    var originalCanvasSize;

    pub.resizeRatio = 1.0;

    pub.hasMobileWidth = function () {
        return jQuery(window).width() <= pub.mobileWidth || global.useMobileVersion();
    };

    var doPosition = function () {
        var $myCanvas = jQuery("#myCanvas");
        var pos = $myCanvas.position();
        var width = $myCanvas.outerWidth();
        var height = $myCanvas.outerHeight();
        pub.positionTriangle2(pos, width, height);
    };

    pub.positionElements = function () {
        if (global.layout.hideControls) {
            jQuery("#plansForm").hide(1000, doPosition);
        }
        else {
            doPosition();
        }
        window.setTimeout(doPosition, 1500);
    };

    pub.positionAbsolutetly = function (elem, posX, posY) {
        jQuery(elem).css({
            position: "absolute",
            top: posY + "px",
            left: posX + "px"
        });
    };

    pub.positionTriangle2 = function () {
        const wheelCanvas = jQuery("#myCanvas");
        var canvasHeight = wheelCanvas.height();
        var wheelCenterHeight = wheelCanvas.position().top + canvasHeight / 2;
        var canvasWidth = wheelCanvas.width();
        var wheelCenterWidth = wheelCanvas.position().left + canvasWidth / 2;
        var triangleCanvas = jQuery("#triangle");
        var triangleAngle = 48;
        var distXFromCanvasCentre = wheelCenterWidth + (canvasWidth / 2 - canvasWidth * 10 / 100) * Math.cos(rotationCheck.toRadians(triangleAngle))
            - 10;
        var distYFromCanvasCentre = wheelCenterHeight - (canvasHeight / 2 - canvasWidth * 10 / 100) * Math.sin(rotationCheck.toRadians(triangleAngle))
            - triangleCanvas.height() * 60 / 100;
        pub.positionAbsolutetly("#triangle", distXFromCanvasCentre, distYFromCanvasCentre);
    };

    var responsiveCanvasListener = function () {

        function adjustCanvasContent(width) {
            context.translate(width / 2, width / 2);
            context.resetRotation();
            imageObj.onload();
        }

        function resizeCanvas() {
            if (ui.hasMobileWidth()) {
                var c = jQuery('#myCanvas');
                var container = jQuery(c).parent();
                if (!originalCanvasSize) {
                    originalCanvasSize = c.attr("width")
                }
                var width = typeof mobileWidth !== "undefined" ? mobileWidth() : jQuery(container).width();
                ui.resizeRatio = width / parseFloat(originalCanvasSize);
                c.attr('width', width); //max width
                c.attr('height', width); //max height
                rectWidth = width;
                rectHeight = width;
                adjustCanvasContent(width);
            }
        }

        //Initial call
        resizeCanvas();

        //Run function when browser resizes
        jQuery(window).resize(resizeCanvas);
    };

    pub.startListeners = function () {
        jQuery("#recWidth").val(rectWidth);
        jQuery("#recHeight").val(rectHeight);
        jQuery("#behaviour").change(function () {
            modeChanged = true;
            anim.stopIt(false);
        });

        jQuery("#showAdvanced").click(function () {
            jQuery("#advanced").toggle("slow", function () {
                const $showAdvanced = jQuery("#showAdvanced");
                const expanderText = $showAdvanced.html() === '+' ? '-' : '+';
                $showAdvanced.html(expanderText);
            });
        });

        jQuery("#yearPlanRestart").text(i18n["Restart"]);
        jQuery("#yearPlanStarter").text(i18n["Virtuescope Predictions"]);
        jQuery("#yearPlanPdf").text(i18n["Download PDF"]);
        let $yearPlanMail = jQuery("#yearPlanMail");
        $yearPlanMail.text(i18n["Send Email"]);
        let startButton = jQuery("#startIt");
        startButton.text(i18n["Play"]);
        jQuery("#stopIt").html(i18n["Pause"]);
        jQuery("#introText").html(i18n["introText"]);

        function fillPlans() {
            const plansCombo = jQuery('#plans');
            plansCombo
                .append(jQuery("<option></option>")
                    .attr("value", "Virtuescope Predictions")
                    .text(i18n["Virtuescope Predictions"]));
            jQuery.each(plans, function (key, value) { // Fills the combo with the year plans
                plansCombo
                    .append(jQuery("<option></option>")
                        .attr("value", plansLength[key])
                        .text(value));
            });
            return plansCombo;
        }

        fillPlans().change(function (event, ui) {
            if (this.value.match(/\d/)) {
                anim.stopIt();
                yearPlan.restart();
                setTimeout(function () {
                    anim.virtueTarget = virtueTargetEnum.PREDICTION;
                    spinnerVirtuescope.show();
                    const virtuescopePredictions = jQuery("#virtuescopePredictions");
                    virtuescopePredictions.html(i18n["Virtuescope Predictions"]);
                    virtuescopePredictions.fadeIn();
                    yearPlan.setPlanLength(jQuery('#plans').val());
                    yearPlan.addUnit();
                }, 1000);
            }
            else {
                yearPlan.restart();
            }
        });
        yearPlan.setWidth();

        $yearPlanMail.click(function (event) {
            yearPlan.downloadMail();
            event.preventDefault();
        });

        loadOnChangePosListener();

        jQuery("#myCanvas").onPositionChanged(doPosition);

        pub.attachStartListener(startButton);

        responsiveCanvasListener();
    };

    var firstStart = true;

    pub.attachStartListener = function (startButton) {
        startButton.button().click(function (e) {
            e.preventDefault();
            if (jQuery(this).text() === i18n["Play"] || jQuery(this).text() === i18n["Play again"]) {
                anim.restartIt();
            }
            else {
                anim.stopIt();
            }
            anim.virtueTarget = virtueTargetEnum.SPIN;
            firstStart = false;
        });
    };

    var loadOnChangePosListener = function () {
        jQuery.fn.onPositionChanged = function (trigger, millis) {
            if (millis == null)
                millis = 100;
            const o = jQuery(this[0]); // our jquery object
            if (o.length < 1)
                return o;

            var lastPos = null;
            var lastOff = null;
            setInterval(function () {
                if (o == null || o.length < 1)
                    return o; // abort if element is non existend any more
                if (lastPos == null)
                    lastPos = o.position();
                if (lastOff == null)
                    lastOff = o.offset();
                var newPos = o.position();
                var newOff = o.offset();
                if (lastPos.top != newPos.top || lastPos.left != newPos.left) {
                    jQuery(this).trigger('onPositionChanged', {lastPos: lastPos, newPos: newPos});
                    if (typeof (trigger) == "function")
                        trigger(lastPos, newPos);
                    lastPos = o.position();
                }
                if (lastOff.top != newOff.top || lastOff.left != newOff.left) {
                    jQuery(this).trigger('onOffsetChanged', {lastOff: lastOff, newOff: newOff});
                    if (typeof (trigger) == "function")
                        trigger(lastOff, newOff);
                    lastOff = o.offset();
                }
            }, millis);

            return o;
        };
    };

    pub.changeBackground = function () {
        if (typeof params !== "undefined" && params.backgroundColor) {
            jQuery(global.targetElement).css("background-color", params.backgroundColor);
        }
    };

    pub.setMaxWidth = function () {
        const $yearPlan = jQuery("#yearPlan");
        const maxWidth = $yearPlan.width();
        $yearPlan.css("max-width", maxWidth + "px");
    };

    pub.changeButtons = function () {
        jQuery("#yearPlanStarter").button();
        jQuery("#yearPlanPdf").button();
        jQuery("#yearPlanMail").button();
        jQuery("#yearPlanRestart").button();
    };

    pub.changeSpinner = function () {
        var spinnerImg = global.findSpinnerImage();
        jQuery("#spinner").attr("src", spinnerImg);
    };

    pub.startAnimOnCanvasClick = function() {
        jQuery("#myCanvas").mousedown(function(event) {
            if(event.which == 1) {
                // anim.restartIt();
            }
        });
    };

    pub.captureMouseMoveOnCanvas = function() {

        var prevY = -1;

        jQuery("#myCanvas").mousedown(function () {
            jQuery(this).mousemove(function () {
                var rotateY = event.pageY;
                if(prevY != -1) {
                    rotateY = (prevY - rotateY);
                }
                anim.rotateExternal(rotateY);
                prevY = event.pageY;
            });
        }).mouseup(function () {
            jQuery(this).unbind('mousemove');
        }).mouseout(function () {
            jQuery(this).unbind('mousemove');
        });
    };

    return pub;
}());

var findImage = function() {
    return global.findWheelImagePath() + "/" + getGlobalLocale() + ".png";
};

imageObj.onload = function () {
    context.drawImage(imageObj, rectWidth / -2, rectHeight / -2, rectWidth, rectHeight);
};

imageObj.src = findImage();

anim.drawTriangle(contextTriangle);

ui.positionElements();

ui.startListeners();

ui.changeBackground();

ui.setMaxWidth();

ui.changeButtons();

ui.changeSpinner();

ui.startAnimOnCanvasClick();

ui.captureMouseMoveOnCanvas();