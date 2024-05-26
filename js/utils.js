//utils.js
(function() {
    function paramsToHash(querystring) {
        querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
        var params = {}, pair, d = decodeURIComponent;
        for (var i = querystring.length - 1; i >= 0; i--) {
            pair = querystring[i].split('=');
            params[d(pair[0])] = d(pair[1]);
        }
        return params;
    }


    function withSlowOSDAnimation(f) {
        var viewport = openSeadragonViewer.viewport;
        var oldValues = {
            centerSpringXAnimationTime: viewport.centerSpringX.animationTime,
            centerSpringYAnimationTime: viewport.centerSpringY.animationTime,
            zoomSpringAnimationTime: viewport.zoomSpring.animationTime
        };
        viewport.centerSpringX.animationTime =
            viewport.centerSpringY.animationTime =
            viewport.zoomSpring.animationTime = 6;
        f();
        viewport.centerSpringX.animationTime = oldValues.centerSpringXAnimationTime;
        viewport.centerSpringY.animationTime = oldValues.centerSpringYAnimationTime;
        viewport.zoomSpring.animationTime = oldValues.zoomSpringAnimationTime;
    }

    function adjustRectForPanel(rect) {
        var newRect = jQuery.extend(true, {}, rect);
        var reservedPortion = panelReservedPortion();
        var newWidth = rect.width / (1 - reservedPortion);
        newRect.x = rect.x - (newWidth - rect.width);
        newRect.width = newWidth;
        return newRect;
    }

    function subtractPanelFromViewport(viewportRect) {
        var reservedPortion = panelReservedPortion();
        var newRect = jQuery.extend(true, {}, viewportRect);
        newRect.width = viewportRect.width * (1 - reservedPortion);
        newRect.x = newRect.x + (viewportRect.width - newRect.width);
        return newRect;
    }

    function panelReservedPortion() {
        var overlay = $("#overlayControls");
        var containerWidth = openSeadragonViewer.viewport.getContainerSize().x;
        var panelWidth = overlay.width() +
            parseInt(overlay.css("margin-left")) +
            parseInt(overlay.css("margin-right"));
        return (panelWidth / containerWidth);
    }

    function calcProximateScene(rect) {
        var maxCoverage = 0;
        var maxLi = null;
        $("#storyList > li").each(function(i, li) {
            var rectArea = rect.width * rect.height;
            var story = $(li).find(".story").data("beehive-story");
            var storyRect = new OpenSeadragon.Rect(parseFloat(story.region.x),
                parseFloat(story.region.y),
                parseFloat(story.region.width),
                parseFloat(story.region.height));
            var intersectRect = rectIntersect(rect, storyRect);
            if (intersectRect !== null) {
                var storyArea = storyRect.width * storyRect.height;
                var intersectArea = intersectRect.width * intersectRect.height;
                var storyIntersectPct = intersectArea / storyArea;
                var viewIntersectPct = intersectArea / rectArea;
                var coverage = (1.2 * storyIntersectPct) + viewIntersectPct;
                if (storyIntersectPct > 0.1 && viewIntersectPct > 0.1 && coverage > maxCoverage) {
                    maxCoverage = coverage;
                    maxLi = li;
                }
            }
        });
        return maxLi;
    }

    function rectIntersect(rectA, rectB) {
        var xL = Math.max(rectA.x, rectB.x);
        var xR = Math.min(rectA.x + rectA.width, rectB.x + rectB.width);
        if (xL >= xR) {
            return null;
        }
        var yT = Math.max(rectA.y, rectB.y);
        var yB = Math.min(rectA.y + rectA.height, rectB.y + rectB.height);
        if (yT >= yB) {
            return null;
        }
        return new OpenSeadragon.Rect(xL, yB, xR - xL, yB - yT);
    }

    // Export functions
    window.utils = {
        paramsToHash,
        withSlowOSDAnimation,
        adjustRectForPanel,
        subtractPanelFromViewport,
        panelReservedPortion,
        calcProximateScene,
        rectIntersect
    };
})();
