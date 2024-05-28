<<<<<<< Updated upstream
import * as initFunctions from './init.js';
let anno;


(function(anno) {


  // Add annotorious-openseadragon CSS and JS and show the 'define region' button
=======
//admin.js
import * as initFunctions from './init.js';

(function() {
  // Add annotorious CSS and JS (which we currently only use for admin),
  // add our custom Annotorious plugin, and show the 'define region' button
  //
  // We're currently linking to annotorious/latest on github, for some reason
  // we had trouble using a local copy.
>>>>>>> Stashed changes
  function addAdminHelperUI() {
    $("<link/>", {
      rel: "stylesheet",
      type: "text/css",
<<<<<<< Updated upstream
      href: "https://cdn.jsdelivr.net/npm/@recogito/annotorious-openseadragon@latest/dist/annotorious-openseadragon.min.css"
    }).appendTo("head");

    $.ajax({
      url: "https://cdn.jsdelivr.net/npm/@recogito/annotorious-openseadragon@latest/dist/annotorious-openseadragon.min.js",
      dataType: "script",
      success: function() {
        // Important to add the plugin BEFORE we make the OpenSeadragon viewer annotatable
        addShowRegionPlugin();
        anno.on('createAnnotation', (annotation) => {
          const bounds = annotation.target.selector.value;
          const [x, y, width, height] = parseBounds(bounds);

          const popupContent = `
          <story>
              <label>${annotation.body[0].value}</label>
              <region x="${x}" y="${y}" width="${width}" height="${height}" />
              <html>${annotation.body[1].value}</html>
          </story>
          `;

          showPopup(popupContent);
        });
=======
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
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  // Parse the bounds from the annotation
  function parseBounds(bounds) {
    const params = new URLSearchParams(bounds);
    return [
      params.get('x'),
      params.get('y'),
      params.get('width'),
      params.get('height')
    ];
  }

  // Display the popup with the XML content
=======
  
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  function annotate(anno) {
    console.log('2',anno);
    var button = document.getElementById('map-annotate-button');
    button.style.color = '#777';
    anno.on('createSelection', function(selection) {      // Reset button style
      button.style.color = '#fff';
=======
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
  
function addShowRegionPlugin() {

  annotorious.plugin.ShowRegionPlugin = function(opt_config_options) { }

  annotorious.plugin.ShowRegionPlugin.prototype.initPlugin = function(anno) {
    // Add initialization code here, if needed (or just skip this method if not)
  }

  annotorious.plugin.ShowRegionPlugin.prototype.onInitAnnotator = function(annotator) {
    // A Field can be an HTML string or a function(annotation) that returns a string
    annotator.popup.addField(function(a) {
      var geometry = a.shapes[0].geometry;

      return '<pre>' +
        '&lt;region\n' +
        '  x="' + geometry.x.toFixed(5) +  '"\n' +
        '  y="' + geometry.y.toFixed(5) +  '"\n' +
        '  width="' + geometry.width.toFixed(5) +  '"\n' +
        '  height="' + geometry.height.toFixed(5) +  '"\n' +
        '/&gt;' +
        '</pre>';
>>>>>>> Stashed changes
    });
  }

  /* In admin mode, we use annotorious, and change it's display
     to give us the coordinates in a form we can just paste into
     a narrative.xml file */
  function addShowRegionPlugin() {
    annotorious.plugin.ShowRegionPlugin = function(opt_config_options) { }

    annotorious.plugin.ShowRegionPlugin.prototype.initPlugin = function(anno) {
      // Add initialization code here, if needed (or just skip this method if not)
    }

<<<<<<< Updated upstream
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
  }

  // Export functions
  window.admin = {
    addAdminHelperUI,
    annotate,
    addShowRegionPlugin
=======
    // Export functions
    window.admin = {
      addAdminHelperUI,
      parseBounds,
      annotate,
      addShowRegionPlugin
>>>>>>> Stashed changes
  };
})(window.anno);