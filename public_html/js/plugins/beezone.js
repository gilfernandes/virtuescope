// Changing the behaviour to mobile behaviour
const setMobile = setInterval(function () {
    if (typeof ui !== "undefined") {
        ui.hasMobileWidth = function () {
            return true;
        };
        clearInterval(setMobile);
    }
}, 1000);

// Used as a fallback in case the
const audioFiles = ["audio/IfIHadADream.mp3", "audio/OmShanti.mp3", "audio/StandUpShivShakti.mp3"];

const audioFileMap = {
    "Tolerance": "audio/Tolerance.m4a",
    "Contentment": "audio/Contentment.m4a",
    "Compassion": "audio/Compassion.m4a",
    "Brotherhood": "audio/Brotherhood.m4a",
    "Simplicity": "audio/Simplicity.m4a",
    "Courage": "audio/Courage.m4a",
    "Patience": "audio/Patience.m4a",
    "Discipline": "audio/Discipline.m4a",
    "Delicacy": "audio/Delicacy.m4a",
    "Humility": "audio/Humility.m4a",
    "Spontaneity": "audio/Spontaneity.m4a",
    "Responsibility": "audio/Responsibility.m4a",
    "Harmony": "audio/Harmony.m4a",
    "Wisdom": "audio/Wisdom.m4a",
    "Faith": "audio/Faith.m4a",
    "Friendship": "audio/Friendship.m4a",
    "Happiness": "audio/Happiness.m4a",
    "Self-confidence": "audio/Self-Confidence.m4a",
    "Detachment": "audio/Detachment.m4a",
    "Enthusiasm": "audio/Enthusiasm.m4a",
    "Discernment": "audio/Discernment.m4a",
    "Purity": "audio/Purity.m4a",
    "Hope": "audio/Hope.m4a",
    "Freedom": "audio/Freedom.m4a",
    "Creativity": "audio/Creativity.m4a",
    "Concentration": "audio/Concentration.m4a",
    "Strength": "audio/Strength.m4a",
    "Serenity": "audio/Serenity.m4a",
    "Respect": "audio/Respect-3.m4a",
    "Lightness": "audio/Lightness.m4a",
    "Honesty": "audio/Honesty.m4a",
    "Generosity": "audio/Generosity.m4a",
    "Flexibility": "audio/Flexibility.m4a",
    "Economy": "audio/Economy.m4a",
    "Determination": "audio/Determination.m4a"
};

const overrideDisplayStartButtonAfter = setInterval(function () {
    if (typeof anim !== "undefined") {

        const displayStartButtonAfterOrig = function () {
            jQuery("#startIt").show().button("option", "disabled", false);
        };

        let playerReady = false;

        anim.displayStartButtonAfter = function (selectedVirtue) {

            function diplayPlayer(song) {
                jQuery("#meditationNow").fadeOut(function () {
                    jQuery("#playerContainer").show();
                    const $jqueryJplayer1 = $("#jquery_jplayer_1");
                    if (playerReady) {
                        const player = setMedia($jqueryJplayer1, song);
                        setTimeout(function () {
                            player.jPlayer("play");
                        }, 2000);
                    }
                    else {
                        $jqueryJplayer1.jPlayer({
                            ready: function () {
                                setMedia($(this), song);
                                // Change the styles of the player.
                                ["jp-mute", "jp-volume-max", "jp-play", "jp-play-bar"].forEach(function (c) {
                                    util.replaceClass(jQuery("." + c), "_player", selectedVirtue + "_player");
                                });
                                playerReady = true;
                                $(this).jPlayer("play");
                            },
                            ended: function () {
                                backToAnimation();
                            },
                            cssSelectorAncestor: "#jp_container_1",
                            swfPath: "/js",
                            supplied: "m4a",
                            useStateClassSkin: true,
                            autoBlur: false,
                            smoothPlayBar: true,
                            keyEnabled: true,
                            remainingDuration: true,
                            toggleDuration: true
                        });
                        $jqueryJplayer1.jPlayer("play");
                    }
                });
            }

            function setMedia($jqueryJplayer1, song) {
                return $jqueryJplayer1.jPlayer("setMedia", {
                    title: $(".virtue").text(),
                    m4a: song,
                    supplied: "m4a"
                });
            }

            function hidePlayer() {
                $("#jquery_jplayer_1").jPlayer("stop");
                jQuery("#playerContainer").hide();
            }

            function backToAnimation(e) {
                if (e) {
                    e.preventDefault();
                }
                jQuery("#backArrow").remove();
                jQuery("#meditationNow").hide();
                jQuery("body").removeClass();
                hidePlayer();
                anim.restartItWith(displayStartButtonAfterOrig);
            }

            (function addMeditateNow() {
                jQuery("#startIt").fadeOut(function () {
                    jQuery("#meditationNow")
                        .fadeIn()
                        .click(function () {
                            const virtueAudio = audioFileMap[selectedVirtue] ? audioFileMap[selectedVirtue]
                                : audioFiles[Math.floor(Math.random() * audioFiles.length)];
                            diplayPlayer(virtueAudio);
                        });
                });
            }());

            if (location.href.indexOf("hideBackButton") === -1) {
                (function addBackButton() {
                    jQuery("body")
                        .prepend("<div id='backArrow'><a href='' id='restartId'>&larr; Back</a></div>");
                    jQuery("#restartId").click(backToAnimation);
                }());
            }

        };

        // Remove the color from the virtue
        anim.colorizeVirtue = function ($content) {
        };

        anim.changeClassAttrs = function (selectedVirtue, backColor) {
            jQuery('body').attr("class", selectedVirtue.toLowerCase());
            jQuery("#meditationNow").css("background-color", backColor);
            jQuery("button.jp-play").css("background-color", backColor);
            jQuery("button.jp-mute").css("background-color", backColor);
            $(".jp-play-bar").css("background", backColor);
        };

        const origChangeElementsAfterStop = anim.changeElementsAfterStop;

        anim.changeElementsAfterStop = function (virtueText, selectedVirtue) {
            setTimeout(function () {
                origChangeElementsAfterStop(virtueText, selectedVirtue);
            }, 2000);
        };

        clearInterval(overrideDisplayStartButtonAfter);
    }
}, 1000);

ui.positionTriangle2 = function () {
    function extractFromCss(element, attribute) {
        return parseFloat(element.css(attribute).replace(/px/, ""));
    }

    let wheelCanvas = jQuery("#myCanvas");
    let canvasHeight = wheelCanvas.height();
    let triangleCanvas = jQuery("#triangle");
    let wheelCenterHeight = (wheelCanvas.position().top + canvasHeight / 2 + extractFromCss(wheelCanvas, "margin-top")) -
        extractFromCss(triangleCanvas, "height") / 2;
    let canvasWidth = wheelCanvas.width();
    let wheelCenterWidth = wheelCanvas.position().left + canvasWidth / 2;
    let triangleAngle = 45;
    let canvasPercentage = 0.6;
    let distXFromCanvasCentre = wheelCenterWidth + (canvasWidth / 2 * canvasPercentage) * Math.cos(rotationCheck.toRadians(triangleAngle))
        - 10;
    let distYFromCanvasCentre = wheelCenterHeight - (canvasHeight / 2 * canvasPercentage) * Math.sin(rotationCheck.toRadians(triangleAngle))
        - triangleCanvas.height() * 60 / 100;
    ui.positionAbsolutetly("#triangle", distXFromCanvasCentre, distYFromCanvasCentre);
};

// Contains the initial animation of the Beezone logo
const beezoneInit = (function() {
    const pub = {};

    pub.processInitAnimation = function(element, callback) {
        if (element.css("transform") === 'none') {
            element.css({"transform": "rotate(360deg)", "transition-duration": "2s"});
            setTimeout(function () {
                jQuery("#splash").fadeOut(function() {
                    jQuery("#myCanvas").fadeIn(function() {
                        jQuery("#triangle").show();
                        jQuery("#splash").remove();
                        if(typeof callback !== "undefined") {
                            callback();
                        }
                    });
                });
            }, 2000);
        }
    };

    return pub;
}());

jQuery("#splash").find("> img").click(function() {
    beezoneInit.processInitAnimation($(this));
});

// Override start listener to make the Beezone logo disappear.
const origRestartIt = anim.restartIt;
anim.restartIt = function() {
    if(document.getElementById("splash")) {
        beezoneInit.processInitAnimation(jQuery("#splash"), function () {
            origRestartIt();
        });
    }
    else {
        origRestartIt();
    }
};