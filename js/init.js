//init.js
import * as utils from './utils.js';
import * as Story from './story.js';
import * as UI from './ui.js';
let beehive_poster;
let beehive_lang;
<<<<<<< Updated upstream
let viewer;
let anno;

// init.js

(function(viewer, anno) {
=======
var anno =null;
// init.js

(function() {

    function setPosterAndLang() {
        var h = window.utils.paramsToHash(window.location.search);
        beehive_poster = h.poster;
        beehive_lang = (typeof h.lang === "undefined") ? 'en' : h.lang;
        return { beehive_poster, beehive_lang };
    }

>>>>>>> Stashed changes
    function setupOpenSeadragonViewer() {
        var dziFile = "./tiles/" + beehive_poster + "/" + beehive_poster + ".dzi";
        viewer = OpenSeadragon({            
            id: "openseadragon",
            showNavigator: false,
            autoHideControls: false,
            prefixUrl: "./openseadragon-bin-4.1.0/images/",
            tileSources: dziFile,
            zoomInButton: 'zoomInBtn',
            zoomOutButton: 'zoomOutBtn',
            homeButton: 'fullPosterBtn',
            minZoomImageRatio: 0.7,
            gestureSettingsTouch: {
                pinchRotate: true
              },
        });
        anno = OpenSeadragon.Annotorious(viewer, {
            widgets: [
              { widget: 'COMMENT', editor: true },
              { widget: 'TAG', vocabulary: ['important', 'review', 'completed'] }
            ],
          });
          anno.setDrawingTool('polygon'); // Enable polygon drawing tool
          return { viewer, anno };

    }



    function setPosterAndLang() {
        var h = window.utils.paramsToHash(window.location.search);
        beehive_poster = h.poster;
        beehive_lang = (typeof h.lang === "undefined") ? 'en' : h.lang;

        return { beehive_poster, beehive_lang };

    }

    function setupAnnotorious() {
        let anno = OpenSeadragon.Annotorious(openSeadragonViewer, {
            locale:'auto',
            widgets: [
              { widget: 'COMMENT', 
              editor: true 
                },
                { widget: 'COMMENT', 
                label: 'label',
                textarea.placeholder: 'placeholder',
                editor: true,
                  },  
              { widget: 'TAG', 
              vocabulary: [ 
                { label: 'Place', uri: 'http://www.example.com/ontology/place' },
                { label: 'Person', uri: 'http://www.example.com/ontology/person' }, 
                { label: 'Event', uri: 'http://www.example.com/ontology/event' }
              ],
            }
            ],
          });
          console.log
          anno.setDrawingTool('rect'); // Enable polygon drawing tool
          console.log('sa',anno);
          return (anno);
    }

    function addControls() {
        var controls = $("#overlayControls");
        var navControls = $("#navControls");
        var minimizedButton = $("#showControlsBtn");
        var container = $("#openseadragon .openseadragon-container");

        $("body").on("click", "#fullPageBtn, #fullScreenInstruction", function(event) {
            event.preventDefault();
            if (OpenSeadragon.isFullScreen()) {
                OpenSeadragon.exitFullScreen();
            } else {
                OpenSeadragon.requestFullScreen(document.body);
            }
            window.UI.adjustTipVisibility($(".controlsText").data("beehive-story-li"));
        });

        if ((!OpenSeadragon.supportsFullScreen) && (!OpenSeadragon.isFullScreen())) {
            $("#fullPageBtn").css("visibility", "hidden");
        }

        controls.on("click", ".controlsMinimize", function(event) {
            event.preventDefault();
            controls.slideUp('slow', function() {
                minimizedButton.fadeIn();
            });
        });

        navControls.on("click", "#showControlsBtn", function(event) {
            event.preventDefault();
            minimizedButton.fadeOut(function() {
                window.UI.storyListHeightLimit();
                controls.slideDown('slow', function() {
                    window.UI.storyListHeightLimit();
                    if ($(".controlsText").is(":visible")) {
                        $(".controlsText").hide();
                        $(".controlsText").fadeIn(1);
                    }
                });
            });
        });

        $("#overlayControls").on("click", ".scene-expander", function(event) {
            event.preventDefault();
            if ($(this).hasClass("open")) {
                window.Story.closeStoryList();
            } else {
                window.Story.openStoryList();
            }
        });

        $("#storyList").on("click", ".story", function(event) {
            event.preventDefault();
            var li = $(this).closest("li");
            window.Story.loadStory(li);
        });

        $(".controls-text-nav").on("click", ".controls-text-nav-prev", function(event) {
            event.preventDefault();
            var li = $(".controlsText").data("beehive-story-li");
            window.Story.loadStory(li.prev());
        });

        $(".controls-text-nav").on("click", ".controls-text-nav-next", function(event) {
            event.preventDefault();
            var li = $(".controlsText").data("beehive-story-li");
            var nextLi;
            if (typeof li == 'undefined') {
                nextLi = $("#storyList li").first();
            } else {
                nextLi = li.next();
            }
            window.Story.loadStory(nextLi);
        });
    }

    function loadPosterData() {
        var fetchUrl = "./narrative/" + beehive_poster + "/" + beehive_lang + ".xml";
        var ajax = $.ajax({
            url: fetchUrl,
            dataType: "xml",
            success: function(xml) {
                xml = $(xml);
                var title_text = xml.find("data > title").text().trim();
                var title_link = xml.find("data > link").text().trim();
                document.title = title_text;
                $("#titleLink").attr("href", title_link).html(title_text.replace(/[\n\r]+/, "<br>"));
                var storyList = $("#storyList");
                xml.find('story').each(function(i, storyXml) {
                    var storyJson = window.Story.storyXmlToJson(storyXml);
                    var li = $("<li/>");
                    var a = $("<a href='#' class='story'/>")
                        .attr('href', window.Story.storyToFragmentUrl(storyJson))
                        .text($(storyXml).find("label").text())
                        .data('beehive-story', storyJson);
                    li.append(a).appendTo(storyList);
                });
                if (storyList.find("li").size() > 1) {
                    $(".controls-story-list-expander").show();
                }
                window.UI.storyListHeightLimit();
            }
        });
        return ajax;
    }

    function gotoInitialView() {
        var params = window.utils.paramsToHash(document.location.hash.replace(/^\#/, ''));
        if (("x" in params) && (params.x !== "") &&
            ("y" in params) && (params.y !== "") &&
            ("w" in params) && (params.w !== "") &&
            ("h" in params) && (params.h !== "")) {
            var rect = new OpenSeadragon.Rect(parseFloat(params.x),
                parseFloat(params.y),
                parseFloat(params.w),
                parseFloat(params.h));
            viewer.viewport.fitBounds(rect);
        } else if ("s" in params) {
            var destLi = $("#storyList li").filter(function(i, li) {
                var story = $(li).find(".story").data("beehive-story");
                return story.label == params.s;
            }).first();
            if (destLi) {
                window.Story.loadStory(destLi);
            }
        } else {
            var li = $("#storyList li:first");
            if (li.size() > 0) {
                window.Story.loadStory(li);
            }
        }
    }
    function addPermalinkFunc() {
        function boundsToParams(bounds) {
          return "x=" + encodeURIComponent(bounds.x.toFixed(5)) +
            "&y=" + encodeURIComponent(bounds.y.toFixed(5)) +
            "&w=" + encodeURIComponent(bounds.width.toFixed(5)) +
            "&h=" + encodeURIComponent(bounds.height.toFixed(5))
        }
      
        function regionString(bounds) {
        return `<story>/n<label></label>/n<region/nx="${bounds.x.toFixed(5)}"/ny="${bounds.y.toFixed(5)}"/nwidth="${bounds.width.toFixed(5)}"/nheight="${bounds.height.toFixed(5)}"/n/>/n<html></html>/n</story>`;
        }
      /* Take an OpenSeadragon.Rect, add it into query params for a link.
           We keep 5 decimal places which is enough for an image 100,000 pixels
           high/wide, which should be plenty (coordinate are relative 0 -> 1 )*/
        function urlWithNewBounds(bounds) {
          var url = window.location.href.split('#')[0];
          var hashParams = {};
      
          hashParams.x = bounds.x.toFixed(5);
          hashParams.y = bounds.y.toFixed(5);
          hashParams.w = bounds.width.toFixed(5);
          hashParams.h = bounds.height.toFixed(5);
      
          url += '#' + jQuery.param(hashParams);
          return url;
        }
      
        /* prepare the modal we'll display permalinks in */
        $("#linkModal").easyModal({
            overlayOpacity: 0.65
        });
      
        /* load data from the narrative file */
        var ajaxLoad = loadPosterData();
        // And go to first story, or specified bounds -- but only after OSD finishes
        // loading AND our ajax loadPosterData is done!
        viewer.addHandler('open', function (event) {
          // always: poster.xml load may not have worked, we still
          // wanna set our view of the tiles.
          ajaxLoad.always(function() {
            gotoInitialView();
          });
        });
      
      
        $("#navControls").on("click", "#makePermaLink", function(event) {
          event.preventDefault();
          var bounds = viewer.viewport.getBounds();
      
      
          $("#linkModalUrlField").val( urlWithNewBounds(bounds) );
          $("#regionField").val(regionString(bounds));
          $("#linkModal").trigger('openModal');
        });
      
      }
      
    // Export functions
    window.initFunctions = {
        setPosterAndLang,
        addPermalinkFunc,
        setupOpenSeadragonViewer,
        setupAnnotorious,
        addControls,
        loadPosterData,
        gotoInitialView
    };
})(window.viewer, window.anno);
