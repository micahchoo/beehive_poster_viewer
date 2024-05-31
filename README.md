## Beehive Poster Viewer

The Beehive Poster Viewer is an application originally developed by Jonathan Rochkind. It is designed to display large images, such as posters, in a zoomable and interactive format. The application is built using HTML and JavaScript, with no special server-side software required. The heavy lifting for large image display and user interface (UI) is handled by the open-source project OpenSeadragon, while annotations are managed through the Annotorious-Openseadragon plugin.

### Key Features

1. **Zoomable Image Display**: The core functionality of the Beehive Poster Viewer is powered by OpenSeadragon, which allows users to zoom in and out of large images seamlessly.
2. **Annotations**: Annotations on the images are facilitated by the Annotorious-Openseadragon plugin, enabling users to add and view notes directly on the images.
3. **Full-Screen Mode**: Users can enter full-screen mode by clicking the honeycomb-shaped icon that looks like a dotted square with a line through it. This mode enhances the viewing experience by utilizing the entire monitor.
4. **Shareable URLs**: Another honeycomb-shaped icon resembling a chain link allows users to generate a URL that points to the specific portion of the poster they are viewing, including the zoom level and boundaries. This feature is useful for sharing or bookmarking specific sections of the poster.
5. **Narrative Toggle**: Users can hide the narrative box by clicking the up arrow in the top right corner, providing a full-screen view of the poster. The narrative box can be restored by clicking the honeycomb button representing lines of text.

### URL Parameters

The Beehive Poster Viewer uses query parameters in the URL to specify which poster to display and in which language. For example:

- `/posterViewer/?poster=mr` loads the poster designated as 'mr'.
- `/posterViewer/?poster=mr&lang=es` loads the 'mr' poster with a Spanish language narrative.

### Adding and Editing Posters

To add a new poster, follow these steps:

1. **Choose a Unique Short Name**: Select a unique short name without spaces, such as 'mr'.
2. **Add Image Tiles and Narrative File**: Place the image tiles in the `tiles` directory and the narrative XML file in the `narrative` directory using the chosen short name.
3. **Edit Narrative**: Modify the narrative XML file to define scenes, order, text, and boundaries on the poster.

Changes to narratives and code should be managed through a Git repository on GitHub. Refer to the provided instructions on using Git and GitHub for more details.

### Development and Local Setup

To develop the Beehive Poster Viewer locally, you can use the `http-server` with the `--cors` option. This setup allows you to serve the application locally with Cross-Origin Resource Sharing (CORS) enabled, which is useful for development and testing purposes.

```bash
npx http-server --cors
```

This command will start a local server with CORS enabled, allowing you to test the application in a local environment.

### Additional Resources

- [How to make image tiles - that are deeply zoomable](./docs/tiles.md)
- [Adding and Editing Narrative - the chapters on the sidebar](./docs/narrative.md)
- [Adding Facebook OpenGraph tags](./docs/facebook_og.md)

For more detailed instructions and documentation, visit the [Beehive Poster Viewer documentation](https://micahchoo.github.io/beehive_poster_viewer/docs/).
