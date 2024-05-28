import * as initFunctions from './init.js';
let anno;


(function(anno) {


  // Add annotorious-openseadragon CSS and JS and show the 'define region' button
  function addAdminHelperUI() {
    $("<link/>", {
      rel: "stylesheet",
      type: "text/css",
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

        $("#map-annotate-button").show();
      }
    });
  }

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
    anno.on('createSelection', function(selection) {      // Reset button style
      button.style.color = '#fff';
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
  };
})(window.anno);