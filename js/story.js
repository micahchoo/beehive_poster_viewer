//story.js

import * as utils from './utils.js';
import * as initFunctions from './init.js';
let sceneTransitionMode;
(function() {
  function loadStory(li, move = true) {
      li = $(li);
      var story = li.find(".story").data("beehive-story");
      if (typeof story === "undefined") return;
      var rect = new OpenSeadragon.Rect(parseFloat(story.region.x),
          parseFloat(story.region.y),
          parseFloat(story.region.width),
          parseFloat(story.region.height));
      $(".controlsText").data("beehive-story-li", li);
      $(".controls-text-nav-prev").css("visibility", (li.prev().size() > 0) ? "visible" : "hidden");
      $(".controls-text-nav-next").css("visibility", (li.next().size() > 0) ? "visible" : "hidden");
      UI.adjustTipVisibility(li);
      $("#storyLabel").text(story.label);
      $("#storyText").html(story.html);
      $(".controlsText").get(0).scrollTop = 0;
      $(".controlsText").slideDown('slow');
      closeStoryList(function() {
          if (move) {
              sceneTransitionMode = true;
              window.utils.withSlowOSDAnimation(function() {
                  rect = window.utils.adjustRectForPanel(rect);
                  openSeadragonViewer.viewport.fitBounds(rect);
              });
          }
      });
  }

  function closeStoryList(func) {
      if ($("#slideContainerOverlay").is(":visible")) {
          $("#slideContainerOverlay").fadeOut('slow');
      }
      $(".controls-story-list").slideUp('slow', function() {
          $(".scene-expander").removeClass("open");
          if (typeof func !== 'undefined') {
              func();
          }
          $("#sceneExpanderImg").attr("src", "./images/expand.png");
      });
  }

  function openStoryList() {
      $("#slideContainerOverlay").fadeIn('slow');
      $(".controls-story-list").slideDown('slow', function() {
          $(".scene-expander").addClass("open");
          $("#sceneExpanderImg").attr("src", "./images/collapse.png");
      });
  }

  function storyXmlToJson(storyXml) {
      storyXml = $(storyXml);
      var json = {};
      json.label = storyXml.find("label").text();
      var htmlElement = storyXml.find("html").get(0);
      var serialized = new XMLSerializer().serializeToString(htmlElement);
      if (htmlElement.childNodes.length === 1 && htmlElement.childNodes[0].nodeType === 3) {
          serialized = "<p>" + serialized + "</p>";
      }
      json.html = serialized;
      var regionXml = storyXml.find("region");
      json.region = {
          x: regionXml.attr("x"),
          y: regionXml.attr("y"),
          width: regionXml.attr("width"),
          height: regionXml.attr("height")
      };
      return json;
  }

  function storyToFragmentUrl(storyJson) {
      var label = storyJson.label;
      if ((typeof label === "undefined") || label.length === 0) {
          return;
      } else {
          return window.location.href.split('#')[0] + "#s=" + encodeURIComponent(label);
      }
  }

  // Export functions
  window.Story = {
      loadStory,
      closeStoryList,
      openStoryList,
      storyXmlToJson,
      storyToFragmentUrl
  };
})();
