## Creating DZI Images Using VIPS

Deep Zoom Image (DZI) is a format that allows you to display high-resolution images efficiently by breaking them into smaller tiles. This tutorial will guide you through the process of creating DZI images using the `vips` tool, an open-source image processing library.

### Prerequisites

Before you begin, ensure you have the following:
- A high-resolution image in TIFF format.
- VIPS installed on your system. You can download it from the [official VIPS website](https://www.libvips.org).

### Installing VIPS

#### Windows
1. Download the latest VIPS binaries (e.g., `vips-dev-w64-web-8.12.2-static.zip`).
2. Extract the zip file to your `C:` drive and rename the folder to `vips`.
3. Add VIPS to your system's PATH:
   - Press the Windows key and type `environment`.
   - Select `Edit the system environment variables`.
   - Click the `Environment Variables` button.
   - Under `System variables`, find `PATH`, select it, and click `Edit`.
   - Click `New` and add `C:\vips\bin`.

#### Linux (Ubuntu)
```bash
sudo apt install libvips-tools
```

### Creating a DZI

1. Open a command line or terminal.
2. Navigate to the directory containing your TIFF image.
3. Run the following command to convert your TIFF image to a DZI:
   ```bash
   vips dzsave "your_image.tiff" output_name
   ```
   This command will create a `output_name.dzi` file and a `output_name_files` directory containing the image tiles.

#### Example Command
```bash
vips dzsave "Heart and Soul Mosaic Watermarked For Web.tiff" heart_soul
```

### Customizing the Output

You can customize the output by adjusting the quality of the tiles or changing the format. For example, to increase the JPEG quality to 90%, use the following command:
```bash
vips dzsave "your_image.tiff" output_name --suffix .jpg[Q=90]
```

### Using OpenSeadragon to View DZI

To view your DZI image, you can use OpenSeadragon, a JavaScript library for displaying large images.

1. Download OpenSeadragon from the [official website](https://openseadragon.github.io/).
2. Create a new directory and move your `output_name.dzi` and `output_name_files` into this directory.
3. Create an `index.html` file with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        #openseadragon1 {
            width: 800px;
            height: 600px;
        }
    </style>
    <script src="openseadragon/openseadragon.min.js"></script>
</head>
<body>
    <div id="openseadragon1"></div>
    <script type="text/javascript">
        OpenSeadragon({
            id: "openseadragon1",
            prefixUrl: "openseadragon/images/",
            tileSources: "output_name.dzi"
        });
    </script>
</body>
</html>
```

4. Open the `index.html` file in a web browser to view your DZI image.

### Running a Local Web Server

Due to security restrictions, modern browsers may not load local files directly. You can run a local web server using Python:

```bash
python -m http.server
```

Navigate to `http://localhost:8000/index.html` in your web browser to view your DZI image.

# Other considerations

Also, note we begin with a TIFF file as input. you want to **begin with a TIFF file saved with an RGB colorspace profile**. You want to start with a TIFF, not a JPG, because a JPG has already lost some original image information, which can lead to poorer quality when libvips resizes for tiles. Using the RGB color profile (instead of CMYK), seems in our experience to significantly decrease file size of generated tiles, without effecting observed quality either way (positive or negative; at first I was hoping it might improve quality in the resize/reduced tiles with vips, but does not seem to). 

## output of libvips dzsave 

In whatever directory you are in, you will get a .dzi file, and a directory of image tiles. Since in the above example we provided `mr` as the output name, you'll see an `mr.dzi` file, and a `mr_files` directory. 

We do not keep these files in git. You'll have to transfer them directory to the web server. On the web server, in the posterViewer directory, go inside the `tiles` directory. Since we chose `mr` as the unique name for this poster, make a subdirectory called `mr` in there. 

And transfer both the `mr.dzi` and `mr_files` direcotry (and all it's contents) *inside* of that `mr` directory. 

You can use whatever method you want to transfer these files but they are BIG. You won't make them any smaller by putting them in a .zip file, as jpg's are already compressed. 

On Mac OSX, I use the command line rsync command, which also let's us set bandwidth limit if we're on a shared connection. 

Let's say we already have an `mr` folder on our local computer, with the dzi and _files directory in it:

    rsync -rv mr beehiveweb@julia.mayfirst.org:beehivecollective.org/web/beehivecollective.org/posterViewer/tiles/


## You can also do this using pyvips in python
Code for windows below


```python
import os

vipsbin = '.\\vips-dev-w64-web-8.15.2\\vips-dev-8.15\\bin'  # Adjust this path to where your libvips binaries are located
os.environ['PATH'] = vipsbin + ';' + os.environ['PATH']
import pyvips

# Set the input folder containing the images
input_folder = './mr'

# Set the output folder for the DZI files
output_folder = './output'

# Ensure the output folder exists
os.makedirs(output_folder, exist_ok=True)

# Loop through all files in the input folder
for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.tif', '.tiff')):  # Add more extensions as needed
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, os.path.splitext(filename)[0])

        # Load the image using pyvips
        image = pyvips.Image.new_from_file(input_path, access='sequential')

        # Save the image as a DZI file using dzsave
        image.dzsave(output_path)

        print(f"Converted {filename} to DZI format.")

print("Conversion complete.")
```