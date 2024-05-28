//ui.js
let i18n_data = {
  en: {
    'next': 'Next',
    'previous': 'Previous',
  },
  es: {
    'next': 'Siguiente',
    'previous': 'Anterior',

  }
};
async function loadI18nData(lang) {
    try {
        const response = await fetch(`./i18n/${lang}.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            
        }
        i18n_data[lang] = await response.json();
    } catch (error) {
        console.error("Unable to fetch i18n data:", error);
    }
}
(function() {

// A span or other element with data-i18n-key="key"
// will have it's text content replaced by the value
// from i18n hashes above.
// data-i18n-title-key will have 'title' attribute
// replaced instead, for <a> mouseovers.
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

function applyI18nValues(lang) {
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
    // Height limits on the story list we couldn't figure out
  // how to do with pure CSS, we'll use some JS that we run on
  // load and screen size change.
  function storyListHeightLimit() {
    // Need to make sure it's a container that makes it onto
    // full screen mode.
    var container = $("#openseadragon");
    var panel     = $("#overlayControls")

    var maxPanelHeight = container.height() -
      panel.position().top -
      parseInt(panel.css('margin-top')) -
      20; // 20px bottom margin we want

    panel.css("max-height", maxPanelHeight);

    // The story list and and the story text area take
    // turns being on the screen once at a time, below
    // the header area. They each need a max height
    // such that they won't overflow the panel.
    var storyListBottom =
      $(".controls-story-list-expander").position().top +
      $(".controls-story-list-expander").outerHeight(true);
    // CSS max-heigh doesn't account for padding or borders, we need
    // to subtract extra to account, we just do a healthy extra amt.
    var maxLowerHeight = maxPanelHeight - storyListBottom - 24;

    panel.find(".controls-story-list, .controlsText").each(function(i, section) {
      $(section).css("max-height", maxLowerHeight);
    });
  }
  window.UI = {
    applyI18nValues: applyI18nValues,
    adjustTipVisibility: adjustTipVisibility,
    storyListHeightLimit: storyListHeightLimit,
    copyToClipboard:copyToClipboard
  };
})();