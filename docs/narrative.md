# The Narrative Files

The text and scene boundaries for the 'narrative tour' portion of a poster are stored in XML files. The title of the poster is also in this file, maybe along other information in the future.

These files **are** controlled by the git repository, please see [instructions for editing git and github](github.md) for best way to edit or add these files. 

The files are stored in the `narrative` directory, inside a subdirectory with the short name you've given to the poster, and then in a file named by language. For instance:

    ./narrative/mr/en.xml

Would be the data file for the poster referred to as `mr` in the posterViewer URL, for English (`en`).

This is an XML file -- XML looks kind of like HTML, but technically it's different. It can be created or edited in a standard text editor, or in some kind of editor made for XML specially, or in [github's web interface](github.md)

To create a new one for a new poster (or new language), it might be easiest to start with one of the existing ones and then copy it. 

## header info in XML file

The top of the XML file begins with an opening `<data>` tag, and a `<title>` and `<link>` tag which give the name of the poster as it should be displayed in the posterViewer, as well as a URL that clicking on the name will take you to (usually the page for this poster on the website)

~~~xml
<data>
  <title>
      Mesoamérica Resiste (Front) from the Beehive Design Collective
  </title>
  <link>
    http://beehivecollective.org/beehive_poster/mesoamerica-resiste/
  </link>
~~~

## Scene/story list

Next, comes a bunch of `<story>` tags, all wrapped in a single '<stories>' tag.

Each story tag defines a scene: a title for that scene (listed in the scene list), the text for that scene, and the boundaries on the poster that should be focused on for that scene.

~~~xml
<story>
      <label>The Colonizers' view</label>
      <region
        x="0"
        y="0"
        width="1.0"
        height="1.0"
      />
      <html>
        This poster folds to create a square with shutters that open to a larger image inside. With the shutters closed, the outside of the poster resembles an old Spanish conquistador’s map
        of Mesoamerica. The map is a top-down look at the region and
        draws parallels between colonial history and modern-day capitalism. Outsiders who have no connection with the land have drawn this map, with motives of extraction and profit.
      </html>
    </story>
~~~

### Finding the region boundaries

The tricky part is finding the right x/y/height/width for the part of the poster you want to focus on.  There is a feature built into the posterViewer to help you do this. 

Add `&admin=true` to the end of a posterViewer URL for a certain poster. Now you can drag a selection on the image while pressing shift. This will open up the annotorious editor, where you can add some placeholder text. After adding the annotation here, you will see a popup with a snippet that you can edit and add to the narrative xml file. This snippet contains the information about the region where the story lies

### Drawing tool
in Admin mode, you also get a button that lets you cycle between using a rectangle or a polygon as an annotation selector.


### The narrative text  is HTML

The text between the `<html>` tags is the text of the particular scene in the narrative. 

If it's just one paragraph, you can just stick the text in here without worrying too much about HTML tags. But you can use multiple `<p>` tags if you need multiple paragraphs; you can also use other html tags, such as an `<a>` tag to make a link, or an `<h4>` tag for a sub-heading.

Since it is HTML, you need to be careful to keep the text legal/valid HTML though (and legal/valid HTML too).  

Any < or > or & characters you want to put in the text can't be put in directly, they need to be entered as HTML-escaped character entities:

* for < enter `&lt;`
* for > enter `&gt;`
* for & enter `&amp;`

Additionally any HTML tags you use need closing tags, becuase it's in XML, even though you may not be used to those being required. For instance, if you enter a `<p>`, you need to close it with a `</p>` at the end of the paragraph. 

## Make sure the whole file is valid XML!

If you save the file to disk somewhere on your computer (use a filename ending .xml), you can try opening it up with the Chrome web browser (file/open, navigate to the file on your local computer) -- if you don't see any error messages, great! If you do see an error message from Chrome, it means there are errors in the XML tags, and the posterViewer isn't going to be able to read the file. 
