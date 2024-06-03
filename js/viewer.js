/* All the javascript we need for the poster viewer in one file

  Sorry this file is a bit of a mess organizationally.

*/



var beehive_poster;
var beehive_lang;
var anno=null;
var currentTool;
var annotation = [];


/* Internationalization (i18n) -- all little text from the UI are in two hashes,
   one english (en), one spanish (es). */
var i18n_data = {}

// Hacky global mode to avoid moving to a new scene and then immediately calculating
// a DIFFERENT scene.
var sceneTransitionMode = false;



// A span or other element with data-i18n-key="key"
// will have it's text content replaced by the value
// from i18n hashes above.
// data-i18n-title-key will have 'title' attribute
// replaced instead, for <a> mouseovers.

/* function applyI18nValues(lang) {
  $(document).find("[data-i18n-key]").each(function(i, el) {
    var key = el.attributes['data-i18n-key'].value;
    var value = i18n_data[lang][key];
    if (value) {
      $(el).text(  value  );
    }
  });

  $(document).find("[data-i18n-title-key]").each(function(i, el) {
    var key = el.attributes['data-i18n-title-key'].value;
    var value = i18n_data[lang][key];
    if (value) {
      $(el).attr('title',  value);
    }
  });
}*/


function paramsToHash(querystring) {
  // remove any preceding url and split
  querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
  var params = {}, pair, d = decodeURIComponent;
  // march and parse
  for (var i = querystring.length - 1; i >= 0; i--) {
    pair = querystring[i].split('=');
    params[d(pair[0])] = d(pair[1]);
  }

  return params;
}

// Take poster and lang from query params &poster=&lang=
function setPosterAndLang() {
  var h = paramsToHash(window.location.search);
  beehive_poster = h.poster;
  beehive_lang   = (typeof h.lang === "undefined") ? 'en' : h.lang;
}

// Hides or shows full-screen tip depending on current
// context -- show, only on the first scene, only if
// we're not in full-screen mode, and full-screen mode is
// possible.
//
// Pass in an 'li' for a scene, so we can determine
// if it's the first scene.
function adjustTipVisibility(li) {
  // Show full screen instructions IFF it's the first element
  // and we can switch to full-screen view
  if (li.prev().size() == 0  && (OpenSeadragon.supportsFullScreen) && (! OpenSeadragon.isFullScreen())) {
    $("#fullScreenInstruction").show();
  } else {
    $("#fullScreenInstruction").hide();
  }
}

// arg is the <li> element containing the .story link
// with story data attached.
function loadStory(li, move) {
  if (typeof move === "undefined")
    move = true;


  li = $(li);
  var story = li.find(".story").data("beehive-story");

  if (typeof story === "undefined")
    return;

  var rect = new OpenSeadragon.Rect(parseFloat(story.region.x),
      parseFloat(story.region.y),
      parseFloat(story.region.width),
      parseFloat(story.region.height));

  // Debugging statements
  console.log("Story region:", story.region);
  console.log("Calculated rect:", rect);

    // Ensure rect values are valid
    if (isNaN(rect.x) || isNaN(rect.y) || isNaN(rect.width) || isNaN(rect.height)) {
      console.error("Invalid rect values:", rect);
      return;
    }

  // Save the li in data for next/prev
  $(".controlsText").data("beehive-story-li", li);

  // Show/hide next/prev buttons based on if
  // we got em
  $(".controls-text-nav-prev").css("visibility",  (li.prev().size() > 0) ? "visible" : "hidden"  );
  $(".controls-text-nav-next").css("visibility",  (li.next().size() > 0) ? "visible" : "hidden"  );

  // Should we make the full-screen tip visible? Make it so.
  adjustTipVisibility(li);

  // Load the story content
  $("#storyLabel").text( story.label );
  $("#storyText").html( story.html  );
  $(".controlsText").get(0).scrollTop = 0;
  $(".controlsText").slideDown('slow');

  closeStoryList(function() {
    if (move) {
      // Avoid calculating a new 'best scene' after animation completes!
      sceneTransitionMode = true;

      withSlowOSDAnimation(function() {
        rect = adjustRectForPanel(rect);

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
    $("#sceneExpanderImg").attr("src", "./images/expand.png")
  });
}

function openStoryList() {
  $("#slideContainerOverlay").fadeIn('slow');

  //$(".controlsText").slideUp('slow', function() {
    $(".controls-story-list").slideDown('slow', function() {
      $(".scene-expander").addClass("open");
      $("#sceneExpanderImg").attr("src", "./images/collapse.png")
    });
  //});
}

// temporarily set OpenSeadragon animation params
// to a very slow animate, then restore.
function withSlowOSDAnimation(f) {
  var viewport = openSeadragonViewer.viewport;

  // save old ones
  var oldValues = {};
  oldValues.centerSpringXAnimationTime = viewport.centerSpringX.animationTime;
  oldValues.centerSpringYAnimationTime = viewport.centerSpringY.animationTime;
  oldValues.zoomSpringAnimationTime = viewport.zoomSpring.animationTime;

  // set our new ones
  viewport.centerSpringX.animationTime =
    viewport.centerSpringY.animationTime =
    viewport.zoomSpring.animationTime =
    6;

  // callback
  f()

  // restore values
  viewport.centerSpringX.animationTime = oldValues.centerSpringXAnimationTime;
  viewport.centerSpringY.animationTime = oldValues.centerSpringYAnimationTime;
  viewport.zoomSpring.animationTime = oldValues.zoomSpringAnimationTime;
}

/* Take an OpenSeadragon.Rect, and make it bigger zo we can zoom
   to it leaving room for the control panel too */
// This function adjusts a given rectangle to make room for the control panel
function adjustRectForPanel(rect) {
  var newRect = jQuery.extend(true, {}, rect)
  var reservedPortion = panelReservedPortion();

    // Ensure reservedPortion is valid
    if (isNaN(reservedPortion) || reservedPortion <= 0 || reservedPortion >= 1) {
      console.error("Invalid reservedPortion value:", reservedPortion);
      reservedPortion = 0; // Default to a reasonable value
    }
  
  // Increase the width of the rectangle to account for the reserved portion
  var newWidth = rect.width / (1 - reservedPortion);
  newRect.x = rect.x - (newWidth - rect.width);
  newRect.width = newWidth;

  return newRect;
}

// opposite of adjustRectForPanel, take a viewport rect,
// and remove the area for legend panel
// This function subtracts the area reserved for the control panel from the viewport rectangle
function subtractPanelFromViewport(viewportRect) {
  var reservedPortion = panelReservedPortion();

  var newRect = jQuery.extend(true, {}, viewportRect);

  // Reduce the width of the rectangle by the reserved portion
  newRect.width  = viewportRect.width * (1 - reservedPortion);
  // Shift the rectangle to the right by the reserved portion
  newRect.x      = newRect.x + (viewportRect.width - newRect.width);

  return newRect;
}



// This function calculates the portion of the viewport that is reserved for the control panel
function panelReservedPortion() {
  // Get the overlay element that contains the control panel
  var overlay = $("#overlayControls");
  // Get the width of the container that holds the OpenSeadragon viewer
  var containerWidth = openSeadragonViewer.viewport.getContainerSize().x;
  // Calculate the width of the control panel, including margins
  var panelWidth = overlay.width() +
    parseInt(overlay.css("margin-left")) +
    parseInt(overlay.css("margin-right"));

      // Ensure containerWidth and panelWidth are valid
  if (containerWidth === 0 || isNaN(panelWidth)) {
    console.error("Invalid container or panel width.");
    return 0.2; // Default to a reasonable value
  }
  // Return the ratio of the panel width to the container width
  return (panelWidth / containerWidth);
}




function setupOpenSeadragonViewer() {
  /* Save in global cause we're gonna need to refer to it and stuff
     and we're too lazy to make a closure right now */

  //eg  "./tiles/mr-inside/mr-inside.dzi"
  var dziFile = "./tiles/" + beehive_poster + "/" + beehive_poster + ".dzi";
  var jpgFile ="./tiles/eu/eu.jpg";

  window.openSeadragonViewer = OpenSeadragon({
    id: "openseadragon",
    //prefixUrl: "http://annotorious.github.io/js/openseadragon/images/",
    showNavigator: false,
    autoHideControls: false,
    prefixUrl: "./openseadragon-bin-4.1.0/images/",
    tileSources: [dziFile,jpgFile],
    sequenceMode: true,
    preserveViewport: true,    
    // We tell OSD to use our own nav buttons, easier than
    // trying to customize OSD's
    zoomInButton: 'zoomInBtn',
    zoomOutButton: 'zoomOutBtn',
    homeButton: 'fullPosterBtn',
    //fullPageButton: 'fullPageBtn',
    minZoomImageRatio: 0.7,
  });
    // Ensure the container has valid dimensions
    var container = document.getElementById('openseadragon');
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      console.error("OpenSeadragon container has invalid dimensions.");
    }
  }


function addControls() {
  var controls = $("#overlayControls");
  var navControls = $("#navControls");
  var minimizedButton = $("#showControlsBtn");
  var container = $("#openseadragon .openseadragon-container");


  //container.append(navControls);
  //container.append(controls);

  // Custom behavior for fullScreen, we want to full screen entire
  // body so our custom controls will still be there.
  //  We do lose OSD's fullscreen-related events this way. We're still
  // using some lower-level OSD events to deal with fullscreen switch.
  // (Skipping OSD's _fullPage_ mode was crucial, to leave our controls
  // on-screen)
  //
  // We can also catch a click on our full screen instructions.
  $("body").on("click", "#fullPageBtn, #fullScreenInstruction", function(event) {
    event.preventDefault();

    if (OpenSeadragon.isFullScreen()) {
      OpenSeadragon.exitFullScreen();
    } else {
      OpenSeadragon.requestFullScreen( document.body );
    }

    // After switching full screen, re-adjust whether full-screen
    // tip is visible.
    adjustTipVisibility($(".controlsText").data("beehive-story-li"));

  });
  // But the hide the button entirely if OSD thinks we can't do full screen.
  if ((!OpenSeadragon.supportsFullScreen) && (! OpenSeadragon.isFullScreen())) {
    $("#fullPageBtn").css("visibility", "hidden");
  }


  // Add minimization behavior
  controls.on("click", ".controlsMinimize", function(event) {
    event.preventDefault();

    controls.slideUp('slow', function() {;
      // wait til animation is done
      minimizedButton.fadeIn();
    });
  });
  navControls.on("click", "#showControlsBtn", function(event) {
    event.preventDefault();


    minimizedButton.fadeOut(function() {
      storyListHeightLimit();

      controls.slideDown('slow', function() {
        // Some issue in Safari (including iOS) is making
        // the control panel lose it's proper max height,
        // and worse the controlsText area strangely appearing
        // as visibility:hidden (even though it's not marked so)
        // on maximization.
        //
        // We recalculate the max height after sliding down,
        // and also need to hide and then quickly fade in (just `show`
        // didn't work!) to make things properly visible and sized
        // in safari after slideDown. (If we just used show instead
        // of slideDown it doesn't seem to trigger the Safari issue,
        // but we like slideDown)
        storyListHeightLimit();

        if ($(".controlsText").is(":visible")) {
          $(".controlsText").hide();
          $(".controlsText").fadeIn(1);
        }
      });



    });
  });


  // Story list expand/contract
  $("#overlayControls").on("click", ".scene-expander",function(event) {
    event.preventDefault();

    if ($(this).hasClass("open")) {
      closeStoryList();
    } else {
      openStoryList();
    }
  });


  // Click on story
  $("#storyList").on("click", ".story", function(event) {
    event.preventDefault();

    var li = $(this).closest("li")

    loadStory(li);
  });

  // Next/prev
  $(".controls-text-nav").on("click", ".controls-text-nav-prev", function(event) {
    event.preventDefault();

    var li = $(".controlsText").data("beehive-story-li");
    loadStory(li.prev());
  });
  $(".controls-text-nav").on("click", ".controls-text-nav-next", function(event) {
    event.preventDefault();

    var li = $(".controlsText").data("beehive-story-li");

    var nextLi;
    if (typeof li == 'undefined') {
      //go with the first one
      nextLi = $("#storyList li").first();
    } else {
      nextLi = li.next();
    }

    loadStory(nextLi);
  });

}

/* Function to create a URL linking to current view, and to
   set current view from URL on load */
function addPermalinkFunc() {
  function boundsToParams(bounds) {
    return "x=" + encodeURIComponent(bounds.x.toFixed(5)) +
      "&y=" + encodeURIComponent(bounds.y.toFixed(5)) +
      "&w=" + encodeURIComponent(bounds.width.toFixed(5)) +
      "&h=" + encodeURIComponent(bounds.height.toFixed(5))
  }
  function regionString(bounds) {
    return `<story><label></label><region x="${bounds.x.toFixed(5)}"y="${bounds.y.toFixed(5)}"width="${bounds.width.toFixed(5)}"height="${bounds.height.toFixed(5)}"<html></html></story>`;
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
  $("#adminModal").easyModal({
    overlayOpacity: 0.65
});
  /* load data from the narrative file */
  var ajaxLoad = loadPosterData();
  // And go to first story, or specified bounds -- but only after OSD finishes
  // loading AND our ajax loadPosterData is done!
  openSeadragonViewer.addHandler('open', function (event) {
    // always: poster.xml load may not have worked, we still
    // wanna set our view of the tiles.
    ajaxLoad.always(function() {
      gotoInitialView();
    });
  });


  $("#navControls").on("click", "#makePermaLink", function(event) {
    event.preventDefault();
    var bounds = openSeadragonViewer.viewport.getBounds();


    $("#linkModalUrlField").val( urlWithNewBounds(bounds) );
    $("#regionField").val(regionString(bounds));
    $("#linkModal").trigger('openModal');
  });

}

// This function takes a storyJson object and generates a URL fragment
// based on the 'label' property of the object
// If the 'label' property is empty or undefined, it returns undefined
function storyToFragmentUrl(storyJson) {
  var label = storyJson.label;
  if ((typeof label === "undefined") || label.length === 0) {
    return;
  } else {
    // It appends the 'label' value to the current URL as a fragment identifier
    // e.g., if the current URL is https://example.com and label is 'scene1',
    // the generated URL would be https://example.com#s=scene1
    return window.location.href.split('#')[0] + "#s=" + encodeURIComponent(label);
  }
}

// We store the story data in XML becuase it's more convenient
// to edit by hand for the sort of data we have (really!), but
// json is easier to deal with in javascript, esp cross-browser.
// This function converts an XML node representing a story into a JSON object
function storyXmlToJson(storyXml) {
  storyXml = $(storyXml); // Wrap the XML node with jQuery for easier manipulation
  var json = {};

  // Extract the 'label' value from the XML node
  json.label = storyXml.find("label").text();

  // Extract the 'html' content from the XML node
  // If the content is just plain text, wrap it in a <p> tag
  var htmlElement = storyXml.find("html").get(0);
  var serialized = new XMLSerializer().serializeToString(htmlElement);
  if (htmlElement.childNodes.length === 1 && htmlElement.childNodes[0].nodeType === 3) {
    serialized = "<p>" + serialized + "</p>";
  }
  json.html = serialized;

  // Extract the 'region' coordinates from the XML node
  var regionXml = storyXml.find("region")
  json.region = {};
  json.region.x = regionXml.attr("x");
  json.region.y = regionXml.attr("y");
  json.region.width = regionXml.attr("width");
  json.region.height = regionXml.attr("height");

  return json;
}

// Go to a view specified in URL, or else open first scene
function gotoInitialView() {
  var params = paramsToHash(document.location.hash.replace(/^\#/, ''));
  if ( ("x" in params ) && (params.x !== "") &&
       ("y" in params ) && (params.y !== "") &&
       ("w" in params ) && (params.w !== "") &&
       ("h" in params ) && (params.h !== "") ) {

    var rect = new OpenSeadragon.Rect(parseFloat(params.x),
      parseFloat(params.y),
      parseFloat(params.w),
      parseFloat(params.h));
    openSeadragonViewer.viewport.fitBounds(rect);
  } else if ("s" in params) {
    // find the scene with matching title to our 's'
    var destLi = $("#storyList li").filter(function(i, li) {
      var story = $(li).find(".story").data("beehive-story");
      return story.label == params.s;
    }).first();
    if (destLi) {
      loadStory(destLi);
    }
  } else {
    // Load the first story
    var li = $("#storyList li:first");
    if (li.size() > 0) {
      loadStory(li);
    }
  }
}

// Loads the poster data, returns the AJAX object, so it can be used as a JQuery
// promise.
function loadPosterData() {
  /* fetch the xml of stories */
  var fetchUrl = "./narrative/" + beehive_poster + "/" + beehive_lang + ".xml";
  var ajax = $.ajax({
    url: fetchUrl,
    dataType: "xml",
    success: function(xml) {
      xml = $(xml);

      var title_text = xml.find("data > title").text().trim();
      var title_link = xml.find("data > link").text().trim();

      document.title = title_text;
      // for the header, replace newlines with <br>s to preserve

      $("#titleLink").attr("href", title_link).html(title_text.replace(/[\n\r]+/, "<br>"));

      // Load scenes
      var storyList = $("#storyList");
      xml.find('story').each(function(i, storyXml){
        var storyJson = storyXmlToJson(storyXml);
        var li        = $("<li/>");
        var a  = $("<a href='#' class='story'/>").
          attr('href', storyToFragmentUrl(storyJson)).
          text($(storyXml).find("label").text()).
          data('beehive-story', storyJson);

        li.append(a).appendTo(storyList);
      });

      // Make the scene list visible only if we actually have
      // scenes, and more than one
      if (storyList.find("li").size() > 1) {
        $(".controls-story-list-expander").show();
      }

      // Adjust heights after load
      storyListHeightLimit();
    }
  });

  return ajax;
}

  // Height limits on the story list we couldn't figure out
  // how to do with pure CSS, we'll use some JS that we run on
  // load and screen size change.
// Function to set height limits on the story list and story text area
function storyListHeightLimit() {
  // Select the container element for the OpenSeadragon viewer
  var container = $("#openseadragon");
  // Select the panel element that contains the overlay controls
  var panel = $("#overlayControls");
  // Check if the screen width is smaller than 768px
  if ($(window).width() < 768) {
    // On small screens, set the maximum height of the panel to the remaining height
    // after subtracting the height of the navigation controls
    var navControlsHeight = $("#navControls").outerHeight(true);
    var maxPanelHeight = container.height() - navControlsHeight - 20; // 20px bottom margin
    panel.position().bottom -
    parseInt(panel.css('margin-bottom')) -
    20; // 20px bottom margin we want
  // Set the calculated maximum height to both the story list and the story text area
  panel.find(".controls-story-list, .controlsText").each(function(i, section) {
    $(section).css("max-height", maxPanelHeight);
  });

  } else {
  // Calculate the maximum height for the panel
  // This is the height of the container minus the top position of the panel,
  // minus the top margin of the panel, minus an additional 20 pixels for bottom margin
  var maxPanelHeight = container.height() -
    panel.position().top -
    parseInt(panel.css('margin-top')) -
    20; // 20px bottom margin we want

  // Set the calculated maximum height to the panel
  panel.css("max-height", maxPanelHeight);

  // Calculate the bottom position of the story list expander
  var storyListBottom =
    $(".controls-story-list-expander").position().top +
    $(".controls-story-list-expander").outerHeight(true);

  // Calculate the maximum height for the lower sections (story list and story text area)
  // This is the maximum panel height minus the bottom position of the story list expander,
  // minus an additional 24 pixels to account for padding and borders
  var maxLowerHeight = maxPanelHeight - storyListBottom - 24;

  // Set the calculated maximum height to both the story list and the story text area
  panel.find(".controls-story-list, .controlsText").each(function(i, section) {
    $(section).css("max-height", maxLowerHeight);
  });
}}

  jQuery(document).ready(function($) {


    // And again if window changes
    $( window ).resize(function(event) {
      storyListHeightLimit();
      if (openSeadragonViewer) {
        openSeadragonViewer.viewport.resize();
        openSeadragonViewer.viewport.goHome(true);
      }
    });
  });

  // Add annotorious CSS and JS (which we currently only use for admin),
  // add our custom Annotorious plugin, and show the 'define region' button
  //
  // We're currently linking to annotorious/latest on github, for some reason
  // we had trouble using a local copy.
  function addAdminHelperUI() {
    $("<link/>", {
      rel: "stylesheet",
      type: "text/css",
      href: "https://cdn.jsdelivr.net/npm/@recogito/annotorious-openseadragon@2.7.14/dist/annotorious.min.css"
    }).appendTo("head");

    $.ajax({
      url: "https://cdn.jsdelivr.net/npm/@recogito/annotorious-openseadragon@2.7.14/dist/openseadragon-annotorious.min.js",
      dataType: "script",
      success: function() {
        // Important to add the plugin BEFORE we make the OpenSeadragon viewer
        // annotatable
        //addShowRegionPlugin();
        anno = setupAnnotorious();
        console.log(anno);
        $("#map-annotate-button").show();
        $("#toggleButton").show();
        $("#docsButton").show();


        //annotate(anno);

        //addShowRegionPlugin(anno);

      }
    });
  }

  
  $("#map-annotate-button").click(function() {
    document.getElementById('adminModal').style.display = 'block';
   // $("#adminModal").trigger('openModal');
  });
  
  function downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Optional: Close the modal when clicking outside of it
  window.addEventListener('click', function(event) {
    if (event.target === adminModal) {
      $("#adminModal").trigger('closeModal');
    }
  });

  function setupAnnotorious() {
    // Initialize Annotorious with OpenSeadragon viewer
    anno = OpenSeadragon.Annotorious(openSeadragonViewer, {
        locale: "en",
        widgets: [ 
          {widget: 'COMMENT', editable: 'MINE_ONLY', purposeSelector: true, typeSelector: true},
          {widget: 'TAG', vocabulary: 'tags'},
        ],
    });
    console.log(anno.locale);
    // Set the drawing tool to rectangle
    let currentTool = 'rect';
    document.getElementById('toggleButton').innerText = `Drawing tool: ${currentTool}`;
    anno.setDrawingTool(currentTool);
    document.getElementById('toggleButton').addEventListener('click', toggleDrawingTool);

    // Array to store annotations

    // Event listener for creating annotations
    anno.on('createAnnotation', function(a) {
        console.log('created', a);
        annotation.push(a);

        // Get the bounds of the annotation
        const bounds = a.target.selector.value;
        let x, y, width, height;

        if (bounds.includes('pixel:')) {
            // Handle rectangle annotation
            const valuesString = bounds.split('pixel:')[1];
            const valuesArray = valuesString.split(',').map(Number);
            [x, y, width, height] = valuesArray;

            // Convert pixel coordinates to normalized coordinates
            const topLeft = openSeadragonViewer.viewport.imageToViewportCoordinates(x, y);
            const bottomRight = openSeadragonViewer.viewport.imageToViewportCoordinates(x + width, y + height);

            x = topLeft.x;
            y = topLeft.y;
            width = bottomRight.x - topLeft.x;
            height = bottomRight.y - topLeft.y;

        } else if (bounds.includes('<polygon')) {
            // Handle polygon annotation
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(bounds, 'image/svg+xml');
            const points = svgDoc.querySelector('polygon').getAttribute('points').split(' ').map(point => {
                const [px, py] = point.split(',').map(Number);
                return { x: px, y: py };
            });

            const xs = points.map(p => p.x);
            const ys = points.map(p => p.y);
            const xmin = Math.min(...xs);
            const xmax = Math.max(...xs);
            const ymin = Math.min(...ys);
            const ymax = Math.max(...ys);

            // Convert pixel coordinates to normalized coordinates
            const topLeft = openSeadragonViewer.viewport.imageToViewportCoordinates(xmin, ymin);
            const bottomRight = openSeadragonViewer.viewport.imageToViewportCoordinates(xmax, ymax);

            x = topLeft.x;
            y = topLeft.y;
            width = bottomRight.x - topLeft.x;
            height = bottomRight.y - topLeft.y;
        }

        console.log('bounds', bounds);

        // Create the popup content with normalized coordinates
        const popupContent = `
        <story>
            <label>${a.body[0].value}</label>
            <region x="${x}" y="${y}" width="${width}" height="${height}" />
            <html>${a.body[0].value}</html>
        </story>
        `;
        showPopup(popupContent, a);
        console.log('popupContent', popupContent);
    });

    // Reset the button color

    return anno;
}


        // Function to toggle drawing tool
        function toggleDrawingTool() {
          currentTool = (currentTool === 'rect') ? 'polygon' : 'rect';
          anno.setDrawingTool(currentTool);
          document.getElementById('toggleButton').innerText = `Current Tool: ${currentTool}`;
      }

  // Function to load i18n JSON files
async function loadI18nData(beehive_lang) {
  try {
      const response = await fetch(`./js/i18n/${beehive_lang}.json`);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      i18n_data[beehive_lang] = await response.json();
  } catch (error) {
      console.error("Unable to fetch i18n data:", error);
  }
}
function copyToClipboard(elementId) {
  // Get the text field
  var copyText = document.getElementById(elementId);

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value).then(function() {
      // Alert the copied text
      alert("Copied the text: " + copyText.value);
  }).catch(function(error) {
      console.error("Failed to copy text: ", error);
  });
}
function showPopup(popupContent, a) {
  // Convert JSON object to a tree view
  function jsonTree(object) {
      let json = "<ul>";
      for (let prop in object) {
          let value = object[prop];
          if (typeof value === "object") {
              let token = Math.random().toString(36).substr(2, 16);
              json += `<li><a class='label' href='#${token}' data-toggle='collapse'>${prop}</a><div id='${token}' class='collapse'>${jsonTree(value)}</div></li>`;
          } else {
              json += `<li>${prop}: ${value}</li>`;
          }
      }
      return json + "</ul>";
  }

  // Display JSON object in the textarea
  document.getElementById('jsonTextArea').value = JSON.stringify(a, null, 2);

  // Display and edit HTML content
  document.getElementById('htmlTextArea').value = popupContent;
  updatePreview();

  // Show the popup
  document.getElementById('popup').style.display = 'block';
  
// Initialize the close on click outside functionality
//closePopupOnClickOutside('popup');
}

// Function to close the popup when clicking outside of it
function closeOnClickOutside(ElementId) {
  const elementa = document.getElementById(ElementId);
  elementa.style.display = 'none';
}


function updatePreview() {
  const htmlContent = document.getElementById('htmlTextArea').value;
  document.getElementById('htmlPreview').innerHTML = htmlContent;
}

  /* Used by actual on-screen annotorious make annotation stuff, which
   we're not really using at present */
   function annotate(anno) {

    };
  
  // Parse the bounds from the annotation
  function parseBounds(bounds) {

    // Step 1: Extract the numeric part of the string
    const numericPart = bounds.split('pixel:')[1];
    
    // Step 2: Convert the string to an array of numbers
    const [x, y, width, height] = numericPart.split(',').map(Number);
    
    // Step 3: Use the values
    console.log(`x="${x}" y="${y}" width="${width}" height="${height}"`);
    
  }
/* In admin mode, we use annotorious, and change it's display
   to give us the coordinates in a form we can just paste into
   a narrative.xml file */
/*function addShowRegionPlugin() {

  annotorious.plugin.ShowRegionPlugin = function(opt_config_options) { }

  annotorious.plugin.ShowRegionPlugin.prototype.initPlugin = function(anno) {
    // Add initialization code here, if needed (or just skip this method if not)
  }

  annotorious.plugin.ShowRegionPlugin.prototype.onInitAnnotator = function(annotator) {
    // A Field can be an HTML string or a function(annotation) that returns a string
    annotator.popup.addField(function(annotation) {
      var geometry = annotation.shapes[0].geometry;

      return '<pre>' +
        '&lt;region\n' +
        '  x="' + geometry.x.toFixed(5) +  '"\n' +
        '  y="' + geometry.y.toFixed(5) +  '"\n' +
        '  width="' + geometry.width.toFixed(5) +  '"\n' +
        '  height="' + geometry.height.toFixed(5) +  '"\n' +
        '/&gt;' +
        '</pre>';
    });
  }

  // Add the plugin like so
  anno.addPlugin('ShowRegionPlugin', {});
}*/

// Pass in an OpenSeadragon Rect, usually representing current
// viewport bounds. We will calculate proximity of the defined
// scenes to try to find which scene most matches
// what you are looking at.
// Function to calculate the most proximate scene based on the current viewport bounds
function calcProximateScene(rect) {
  var maxCoverage = 0; // Initialize the maximum coverage to zero
  var maxLi = null; // Initialize the variable to store the list item with the maximum coverage

  // Iterate over each list item in the story list
  $("#storyList > li").each(function(i, li) {
    var rectArea = rect.width * rect.height; // Calculate the area of the current viewport rectangle

    // Retrieve the story data attached to the current list item
    var story = $(li).find(".story").data("beehive-story");

    // Create a new OpenSeadragon.Rect object for the story's region
    var storyRect = new OpenSeadragon.Rect(parseFloat(story.region.x),
      parseFloat(story.region.y),
      parseFloat(story.region.width),
      parseFloat(story.region.height));

    // Calculate the intersection between the current viewport rectangle and the story's region
    var intersectRect = rectIntersect(rect, storyRect);
    if (intersectRect !== null) { // If there is an intersection
      var storyArea = storyRect.width * storyRect.height; // Calculate the area of the story's region
      var intersectArea = intersectRect.width * intersectRect.height; // Calculate the area of the intersection

      // Calculate the percentage of the story's region that is intersected
      var storyIntersectPct = intersectArea / storyArea;
      // Calculate the percentage of the viewport that is intersected
      var viewIntersectPct  = intersectArea / rectArea;

      // Calculate the coverage score, giving more weight to the story's intersection percentage
      var coverage = (1.2 * storyIntersectPct) + viewIntersectPct;

      // If the coverage is significant and greater than the current maximum coverage, update maxCoverage and maxLi
      if (storyIntersectPct > 0.1 && viewIntersectPct > 0.1 && coverage > maxCoverage) {
        maxCoverage = coverage;
        maxLi = li;
      }
    }
  });

  return maxLi; // Return the list item with the maximum coverage
}

// Function to calculate the intersection of two rectangles
// Returns null if no intersection, otherwise returns an OpenSeadragon.Rect of the intersection
function rectIntersect(rectA, rectB) {
  var xL = Math.max(rectA.x, rectB.x); // Calculate the leftmost x-coordinate of the intersection
  var xR = Math.min(rectA.x + rectA.width, rectB.x + rectB.width); // Calculate the rightmost x-coordinate of the intersection

  if (xL >= xR) { // If there is no horizontal intersection, return null
    return null;
  }

  var yT = Math.max(rectA.y, rectB.y); // Calculate the topmost y-coordinate of the intersection
  var yB = Math.min(rectA.y + rectA.height, rectB.y + rectB.height); // Calculate the bottommost y-coordinate of the intersection

  if (yT >= yB) { // If there is no vertical intersection, return null
    return null;
  }

  // Return a new OpenSeadragon.Rect representing the intersection
  return new OpenSeadragon.Rect(xL, yB, xR - xL, yB - yT);
}




setPosterAndLang();

if (paramsToHash(document.location.search).admin === "true") {
  addAdminHelperUI();
}

jQuery( document ).ready(function( $ ) {
  setupOpenSeadragonViewer();
  addControls();
  addPermalinkFunc();

  // Once on load
  storyListHeightLimit();

  loadI18nData(beehive_lang);

// This is an event handler that is called when an animation finishes in the OpenSeadragon viewer
openSeadragonViewer.addHandler('animation-finish', function(target, info) {
  // If the animation was triggered by explicitly loading a scene, don't recalculate the scene
  if (sceneTransitionMode) {
    sceneTransitionMode = false;
    return;
  }

  // Get the current viewport bounds
  var bounds = target.eventSource.viewport.getBounds();

  // Subtract the area reserved for the control panel from the viewport bounds
  var bestLi = calcProximateScene(subtractPanelFromViewport(bounds));

  // If no scene matches the current viewport, hide the story panel
  if (bestLi == null) {
    $(".controlsText").hide();
  } else if ($(".controlsText").data("beehive-story-li") == undefined || bestLi != $(".controlsText").data("beehive-story-li").get(0)) {
    // If a scene matches the current viewport and it's not already loaded, load it
    loadStory(bestLi, false);
  }
});

  // for some reason keypress event doesn't work in chrome,
  // keydown or keyup do. let's go with keydown. in chrome
  // at least keydown does repeat if you hold the key down, go figure.
  $(document).on("keydown", function(event) {
    var x = 1;

    //event.preventDefault();

    // pass it to the OSD viewer
    var newEvent = jQuery.Event('keypress');
    newEvent.which = event.which;
    newEvent.keyCode = event.keyCode;
    $("#openseadragon .openseadragon-container").focus().trigger(newEvent);
  });


});
