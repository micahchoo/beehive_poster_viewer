# Software overview of the poster viewer

## Architecture

The poster viewer is just HTML and Javascript (and CSS, and XML definitions of scenes, and tile iamges, etc.) -- there is no software running on the server, just static files delivered by a web server. 

There is an [.htaccess file](../.htaccess) that includes some commands to the web server to control caching headers (for the web browser), and maybe in the future some redirections. This file is in the git repo and should be edited in [git](./github.md)

There is basically one [HTML file base](../viewer.html), which links to a [local javascript file](../js/main.js) and our one [CSS file](../css/viewer.css). The HTML also links to our third-party javascript dependencies (not currently using any tools to aggregate all our JS dependencies into one JS file, as is often considered best practices these days; not sure if it's worth it in this case)

main.js also links to other js files in a IIFE implementation
#### `main.js`:
- `init()`: Initializes the application by setting up event listeners, loading data, and updating the UI.
- `loadData()`: Loads data from a JSON file using an AJAX request.
- `updateStory(storyData)`: Updates the story content based on the provided data.
- `nextPage()` and `prevPage()`: Navigate to the next or previous page of the story.
- `zoomIn()` and `zoomOut()`: Zoom in or out of the story content.
- `toggleFullScreen()`: Toggles the application between fullscreen and normal mode.

#### `ui.js`:
- Contains functions for updating various UI elements such as the story title, navigation buttons, zoom buttons, and fullscreen button.
- Handles UI interactions and updates the corresponding elements based on user actions.

#### `init.js`:
- Initializes the application by setting up event listeners for buttons and touch events.
- Handles touch events for navigating between pages and zooming in/out.

#### `admin.js`:
- Contains functions for administrative tasks such as editing the story content.
- `editStory(storyId)`: Allows editing the content of a specific story.
- `saveStory(storyId, content)`: Saves the edited story content.

#### `story.js`:
- Defines a `Story` class that represents a story object.
- Contains methods for loading and saving story data, as well as updating the story content.

#### `utils.js`:
- Contains utility functions used throughout the application.
- `loadJSON(url, callback)`: Loads JSON data from a specified URL using an AJAX request.
- `createElement(tag, className, content)`: Creates a new DOM element with the specified tag, class, and content.
- `showElement(element)` and `hideElement(element)`: Shows or hides a DOM element.
- `getTranslation(key)`: Retrieves the translation for a given key from the language file.

Overall, the code follows a modular structure, separating concerns into different files. The `main.js` file serves as the entry point, initializing the application and handling core functionality. The `ui.js` file manages UI interactions and updates, while `init.js` sets up event listeners. The `admin.js` file contains administrative functions for editing stories. The `story.js` file defines the `Story` class, and `utils.js` provides utility functions used throughout the codebase.

Remember to handle asynchronous operations appropriately and ensure proper error handling when making AJAX requests or loading data.


The HTML file also links to font(s) from Google Fonts, that we are using. 

## Javascript Dependencies

### OpenSeadragon

The real hard work of the poster viewer is done by the [OpenSeadragon](https://github.com/openseadragon/openseadragon) JS file. 

We include a [copy of OpenSeadragon locally](../openseadragon-bin-4.1.0) in the git repo and on the web server. At time of writing, that was OpenSeadragon 4.1.0. To upgrade to a newer version of OpenSeadragon, you'd just add the new version to the git repo, and change the link in the viewer.html file to point to the new version -- we intentionally use version numbers in the directory we put OpenSeadragon in, so we can tell browsers to cache it forever, but if we upgrade OpenSeadragon the new version will be at a new URL. 

### Annotorious
> This has to be updated for the annotorious-osd plugin

[Annotorious](http://annotorious.github.io/) is another Javascript library, that is compatible with OpenSeadragon, for adding annotations to images. 

Currently, we only use Annotorious in our admin interface for defining region boundaries that will be cut and pasted into the narrative XML file. We may use it in the future to support additional features for end users. 

Our viewer.html file links out to annotorious hosted externally. For some reason, when I tried copying annotorious into our local repo/directory, I had trouble getting it to work. Since at the moment it's just an admin interface, i didn't spend any more time on it, and just left it this way. 

### easyModal

We use [easyModal.js](http://flaviusmatis.github.io/easyModal.js/) for displaying the 'link' popup window. We have a [local copy of easyModal.js](../js/jquery.easyModal.min.js) in the repo/web server directory, that viewer.html links to. We ran the easyModal.js through a JS minimizer ourselves to reduce file size. 

## i18n language localization

Most of the language-specific text (English, Spanish, etc) for a given poster is in the narrative XML files. But there are a few parts of the general UI that need textual words. 

We use a fairly simple homegrown system for localizing these depending on the `&lang=` URL parameter. 

Not all of the UI has been properly localized using this system yet, and this area is really still not entirely finished, just a start.

The `i18n` folder contains language files for internationalization. The `en.json` and `es.json` file contains English and Spanish translations for various UI elements and messages used in the application, other languages can be used as well. 