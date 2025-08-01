# SPYOSCAPE

**SPYOSCAPE ([spyoscape.dk](https://spyoscape.dk))** is a (work in progress) hobby project that aims to localise and map the artwork of the Danish graffiti artist **SPYO**. The artwork included on this site contains only political statements, phrases or alike. This means that regular tags and throwups etc. are not mapped.

![spyoscape.dk](spyoscape.png)

**How do you know it actually is SPYO?**  
I don't. I make an educated guess based on context, painting style and letter formatting.

**Am I missing something?**  
You are very welcome to create a pull request with images of artwork I have not yet mapped. The process for doing so is described at the [contribution section](#contribution) section. Thank you for stopping by!

# Contribution
To add your submission to the project, follow the following procedure.

1. Add your image to static/images/. Please prioritise landscape oriented photos.
   - The naming of the image should be the quote in lower case with dashes instead of spaces. If the quote is long, it can be truncated with three dots. E.g. `very-long-quote-must....jpg`
   - Do you best to exclude the faces of bypassers when taking the photo.
2. run the enroll.py script with your image as the only argument and enter the data prompted for.

**E.g.:**

```shell
(venv) user@host:~/spyoscape$ python enroll.py static/images/the-beauty-of-ethnicity.jpg 
Enter the quote: THE BEAUtY OF EtHNiCitY
Enter comma-separated author names (default: SPYO): 
No GPS data found in the image.
Enter coordinates in format: lat, lng (e.g., 55.123123, 12.123123): 55.708228,12.548157
Image resized to 1920px wide and EXIF removed: static/images/the-beauty-of-ethnicity.jpg
Inserted new quote and updated static/js/data.json.
```

# Contribution (deprecated)
1. Add your image to static/images/. Please prioritise landscape oriented photos.
   - The naming of the image should be the quote in lower case with dashes instead of spaces. If the quote is long, it can be truncated with three dots. E.g. `very-long-quote-must....jpg`
   - Do you best to exclude the faces of bypassers when taking the photo. 
2. Enter the data for the new image in `static/js/data.json`.
   - The list is alphabetically sorted, so find the suitable place.
   - The primary key is  should be the full quote, following the capitalisation of the artwork.
   - **lat/lng**
     - The `lat`/`lng` should be reflecting the position from where the image was taken. You may use `generate-image-entry.py` to generate the boilerplate JSON and extract the `lat`/`lng` from the image (please verify them). The usage is `python generate-image-entry.py static/images/<image>.jpg` and the script requires the python [`exif`](https://pypi.org/project/exif/) package. If GPS information is not included in the exif data, you can enter the coordinates manually.
   - **authors**
     - The `author` key is a list of authors. It must at least contain **SPYO**.
   - **image**
      - The `image` key is a path to the image. Should be static/images/<your-image>.jpg
3. Run `make image IMG=<path to image>` to resize the image to a width of 1920 pixels and remove the exif data. `make image` requires the imagemagick and libimage-exiftool-perl (exiftool) packages.
4. Submit a pull request!
