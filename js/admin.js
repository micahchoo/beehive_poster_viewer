//admin.js
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
      href: "./bin/annotorious-2.7.13/annotorious.min.css"
    }).appendTo("head");

    $.ajax({
      url: "./bin/annotorious-2.7.13//annotorious.min.js",
      dataType: "script",
      success: function() {
        // Important to add the plugin BEFORE we make the OpenSeadragon viewer
        // annotatable
        addShowRegionPlugin();

        anno.makeAnnotatable(openSeadragonViewer);

        $("#map-annotate-button").show();
      }
    });

  }
  /* Used by actual on-screen annotorious make annotation stuff, which
   we're not really using at present */
function annotate() {
  var button = document.getElementById('map-annotate-button');
  button.style.color = '#777';

  anno.activateSelector(function() {
    // Reset button style
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
})();