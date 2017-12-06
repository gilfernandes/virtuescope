var virtueTargetEnum = {
    PREDICTION: 1,
    SPIN: 2
};
var rotationCheck = (function () {

    return {
        toDegrees: function (angle) {
            return angle * (180 / Math.PI);
        },
        angle: function (cos, sin) {
            return this.toDegrees(Math.atan(cos / sin));
        },
        toRadians: function (angle) {
            return angle * (Math.PI / 180);
        },
        getAbsoluteRotation: function () {
            return [this.angle(context.getMatrix()[1][0], context.getMatrix()[1][1]),
                this.angle(context.getMatrix()[0][1], context.getMatrix()[0][0])];
        }
    }
}());


var anim = (function () {

    var TO_RADIANS = Math.PI / 180;

    var pub = {};

    pub.virtueTarget = virtueTargetEnum.SPIN;

    pub.drawTriangle = function (ctx) {
        ctx.fillStyle = '#f00';
        ctx.rotate(-40 * TO_RADIANS);
        ctx.translate(-30, 27);
        ctx.beginPath();
        ctx.moveTo(50, 20);
        ctx.lineTo(75, 30);
        ctx.lineTo(75, 10);
        ctx.fill();
    };

    pub.initRotate = function () {
        return Math.floor((Math.random() * pub.randomizeStart()) + 1) + 2;
    };

    pub.randomizeStart = function() {
        return Math.floor(Math.random() * 40) + 1
    };

    pub.rotate = function (context) {
        context.rotate(rotation);
        context.drawImage(imageObj, rectWidth / -2, rectHeight / -2, rectWidth, rectHeight);
    };


    pub.drawRotate = function (context) {
        // translate context to center of canvas
        let mode = findMode();
        if (mode === 1) {
            rotation = Math.PI / rotate++;
        }
        else if (mode === 2) {
            rotation = rotate * TO_RADIANS;
        }
        else if (mode === 3) {
            rotation = rotate++ * TO_RADIANS;
        }
        degrees += (rotation * (180 / Math.PI));
        degrees = degrees % 360;
        this.rotate(context);
    };

    pub.rotateExternal = function (x) {

        rotate = rotate + x;
        var dir = x < 0 ? 1 : -1;
        rotation = dir * Math.PI / (rotate + 720) + dir * 0.01;
        this.rotate(context);
    };

    pub.animate = function (canvas, context, startTime) {

        // clear
        context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        anim.drawRotate(context);
        let mode = findMode();
        if (modeChanged) {
            anim.stopIt(true);
            return;
        }
        if ((mode == 1 || mode == 3) && (stop || (rotation < stopThreshhold))) {
            anim.stopIt(true);
            return;
        }
        else if (mode == 2 && stop) {
            if (rotation < stopThreshhold) {
                anim.stopIt(true);
                return;
            }
            rotate -= 0.1;
        }
        // request new frame
        requestAnimFrame(function () {
            anim.animate(canvas, context, startTime);
        });
    };

    pub.colorizeVirtue = function ($content, selectedVirtue) {
        $content.css("background-color", backColors[selectedVirtue]);
        $content.css("color", foregroundColor[selectedVirtue]);
    };

    // Used for changing for tagging elements with virtues.
    pub.changeClassAttrs = function(selectedVirtue, backColor) {};

    pub.displayVirtue = function(virtueText) {
        var selectedVirtue = extractSelectedVirtue();
        var $content = jQuery("#virtuescopeContent");
        $content.css("background-color", "white");

        pub.changeClassAttrs(selectedVirtue, backColors[selectedVirtue]);

        if (ui.hasMobileWidth()) { // mobile version
            jQuery("#canvasContainer").fadeOut(function () {
                jQuery("#virtuescopeContainer").prepend(jQuery("#textDisplay").detach());
                $content.fadeIn();
            });
        }
        else {
            $content.fadeIn();
        }

        if (!useImgs) {
            pub.colorizeVirtue($content, selectedVirtue);
            $content.html(virtueText !== null ? virtueText : i18n["Work in progress"]);
        }
    };

    function extractSelectedVirtue() {
        return virtueMap[(360 - (Math.floor(rotationCheck.toDegrees(context.getRotation()))) + 315) % 360];
    }

    pub.stopIt = function (displayCard) {
        stop = true;

        if (displayCard) {
            var selectedVirtue = extractSelectedVirtue();
            var speed = 1000;
            var virtueText = "<h2 class='virtue'>" + selectedVirtue + "</h2>" + virtueTexts[selectedVirtue];

            jQuery("#introText").html("");

            hist.saveHistory(virtueText);
            pub.changeElementsAfterStop(virtueText, selectedVirtue)
        }
        return false;
    };

    pub.displayStartButtonAfter = function (selectedVirtue) {
        jQuery("#startIt").fadeOut(function () {
            jQuery(this).button("option", "disabled", false);
            if (jQuery(this).find(".ui-button-text").length) {
                jQuery(this).find(".ui-button-text").text(i18n["Play again"]);
                jQuery(this).fadeIn();
            }
            else {
                jQuery(this).text(i18n["Play again"]).fadeIn();
            }
        });
    };

    function displayPrediction(virtueText) {
        const contentDiv = document.getElementById("virtuescopeContent");
        const selectedVirtue = extractSelectedVirtue();
        if (!useImgs) {
            contentDiv.innerHTML = virtueText !== null ? virtueText : i18n["Work in progress"];
        }
        else {
            const imgPath = location.href.replace(/(.+\/).*/, "$1").replace(/#/, "");
            contentDiv.innerHTML = virtueImages[selectedVirtue] ?
                "<img src='" + imgPath + "../images/" + virtueImages[selectedVirtue] + "'/><p>" + util.ellipsis(virtueTexts[selectedVirtue], 90) + "</p>" :
                "<h2 class='virtue'>" + selectedVirtue + "</h2>" + virtueTexts[selectedVirtue];
        }
        yearPlan.showVirtue(yearPlan.monthForVirtue, contentDiv.innerHTML, selectedVirtue);
    }

    pub.changeElementsAfterStop = function(virtueText, selectedVirtue) {
        pub.displayStartButtonAfter(selectedVirtue);
        if (yearPlan.monthForVirtue > -1 && anim.virtueTarget === virtueTargetEnum.PREDICTION) {
            displayPrediction(virtueText);
        }
        else if (anim.virtueTarget === virtueTargetEnum.SPIN) {
            pub.displayVirtue(virtueText);
        }
    };

    pub.restartIt = function () {

        return pub.restartItWith(function () {
            requestAnimFrame(function () {
                const startTime = (new Date()).getTime();
                rotate = anim.initRotate();
                anim.animate(canvas, context, startTime);
            });
        });
    };

    pub.restartItWith = function (fun) {
        stop = false;
        modeChanged = false;
        jQuery("#virtuescopeContent").fadeOut(function () {
            jQuery("#canvasContainer").show();
            jQuery("#startIt").button("option", "disabled", true);
            fun();
        });

        return false;
    };

    function findMode() {
        return document.getElementById('behaviour') ? parseInt(document.getElementById('behaviour').value) : 1;
    }

    return pub;
}());