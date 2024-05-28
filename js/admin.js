//admin.js
import * as initFunctions from './init.js';

(function() {
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
        var annotation = [];
        var anno = null;
        anno = window.initFunctions.setupAnnotorious();
        anno.on('createAnnotation', function(a) {
          console.log('created', a);
          annotation.push(a);
          const bounds = a.target.selector.value;
          // Step 1: Extract the part after 'pixel:'
          const valuesString = bounds.split('pixel:')[1];
          // Step 2: Split the string into an array of values
          const valuesArray = valuesString.split(',').map(Number);
          // Step 3: Destructure the array into variables
          const [x, y, width, height] = valuesArray;
          console.log('bounds',bounds);

          const popupContent = `
          <story>
              <label>${a.body[0].value}</label>
              <region x="${x}" y="${y}" width="${width}" height="${height}" />
              <html>${a.body[1].value}</html>
          </story>
          `;
          showPopup(popupContent);
          console.log('popupContent',popupContent);
        });
        //addShowRegionPlugin(anno);
        $("#map-annotate-button").show();
        return(anno);
      }
    });
  }

  
  // Parse the bounds from the annotation
  function parseBounds(bounds) {

    // Step 1: Extract the numeric part of the string
    const numericPart = bounds.split('pixel:')[1];
    
    // Step 2: Convert the string to an array of numbers
    const [x, y, width, height] = numericPart.split(',').map(Number);
    
    // Step 3: Use the values
    console.log(`x="${x}" y="${y}" width="${width}" height="${height}"`);
    
  }

  // Display the popup with the XML template content
  function showPopup(content) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = content;

    document.body.appendChild(popup);

    // Add styling and positioning logic for the popup
    popup.style.position = 'absolute';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.padding = '10px';
  }

  /* Used by actual on-screen annotorious make annotation stuff, which
   we're not really using at present */
   function annotate(anno) {
    console.log('2',anno);
    var button = document.getElementById('map-annotate-button');
    button.style.color = '#777';
    //anno.on('createSelection', function(selection) {      // Reset button style
    //  button.style.color = '#fff';
    //});
  }

/* In admin mode, we use annotorious, and change it's display
   to give us the coordinates in a form we can just paste into
   a narrative.xml file */
  


  /* In admin mode, we use annotorious, and change it's display
     to give us the coordinates in a form we can just paste into
     a narrative.xml file */
  function addShowRegionPlugin() {
    annotorious.plugin.ShowRegionPlugin = function(opt_config_options) { }

    annotorious.plugin.ShowRegionPlugin.prototype.initPlugin = function(anno) {
      // Add initialization code here, if needed (or just skip this method if not)
    }

    // Export functions
    window.admin = {
      addAdminHelperUI,
      parseBounds,
      annotate,
      addShowRegionPlugin
  };
}})(window.anno);