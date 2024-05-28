//main.js

import * as utils from './utils.js';
import * as initFunctions from './init.js';
import * as UI from './ui.js';
import * as Story from './story.js';
import * as admin from './admin.js';
// Importing functions from different modules

// Initialize global variables
var beehive_poster;
var beehive_lang;
var viewer;
var anno;
const result = window.initFunctions.setPosterAndLang(beehive_poster, beehive_lang); // Set poster and language from query params
beehive_poster = result.beehive_poster;
beehive_lang = result.beehive_lang;

/* Internationalization (i18n) -- all little text from the UI are in two hashes,
   one english (en), one spanish (es). */
var i18n_data = {};

   // Hacky global mode to avoid moving to a new scene and then immediately calculating
   // a DIFFERENT scene.
var sceneTransitionMode = false;



// Function to load JSON files
async function loadI18nData(beehive_lang) {
    try {
        const response = await fetch(`./i18n/${beehive_lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        i18n_data[lang] = await response.json();
    } catch (error) {
        console.error("Unable to fetch i18n data:", error);
    }
}
// Add event listeners for window resize
jQuery(document).ready(function($) {


    // And again if window changes
    $( window ).resize(function(event) {
        window.UI.storyListHeightLimit();
    });
  });



jQuery( document ).ready(function( $ ) {
var resulta = window.initFunctions.setupOpenSeadragonViewer(beehive_poster, viewer, anno);
viewer = resulta.viewer;
anno = resulta.anno;
document.getElementById('map-annotate-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    console.log('1',anno);
    window.admin.annotate(anno);
  });
    // Add admin helper UI if in admin mode
/*
if (window.utils.paramsToHash(document.location.search).admin === "true") {
    window.admin.addAdminHelperUI();
}*/


// Add controls to the viewer
window.initFunctions.addControls();

// Load poster data
window.initFunctions.loadPosterData(beehive_poster, beehive_lang);

// Go to the initial view
window.initFunctions.gotoInitialView();

window.initFunctions.addPermalinkFunc(viewer);

// Adjust story list height limit
window.UI.storyListHeightLimit();
// Apply internationalization values
window.UI.applyI18nValues(beehive_lang);

// Add event listeners for OpenSeadragon viewer
viewer.addHandler('animation-finish', function(target, info) {
    // If the animation finished after we explicitly loaded a scene,
    // do NOT re-calculate and load a DIFFERENT scene!
    if (sceneTransitionMode) {
        sceneTransitionMode = false;
        return;
    }

    var bounds = target.eventSource.viewport.getBounds();
    var bestLi = utils.calcProximateScene(utils.subtractPanelFromViewport(bounds, viewer), viewer);

    if (bestLi == null) {
        // Unload any story, but leave 'next' button.
        $(".controlsText").hide();
    } else if ($(".controlsText").data("beehive-story-li") == undefined || bestLi != $(".controlsText").data("beehive-story-li").get(0)) {
        // Load it unless it's already loaded.
        window.Story.loadStory(viewer, bestLi, false);
    }
});

// Add event listener for keydown events
$(document).on("keydown", function(event) {
    var x = 1;

    // Pass it to the OSD viewer
    var newEvent = jQuery.Event('keypress');
    newEvent.which = event.which;
    newEvent.keyCode = event.keyCode;
    $("#openseadragon .openseadragon-container").focus().trigger(newEvent);
});
});









// Exporting functions for external use
export {
    Story,
    initFunctions,
    utils,
    UI,
    admin
};
