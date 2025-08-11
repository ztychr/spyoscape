#!/usr/bin/env python3

import sys
import re
import json
import os
from exif import Image as ExifImage
from PIL import Image as PILImage

DATA_FILE = 'static/js/data.json'

def format_dms(degrees, minutes, seconds, ref):
    return_string = f"{degrees}°{minutes}'{seconds}\""
    return_string = str(return_string.replace(',', '.'))
    return_string = re.sub(r'[() ]', '', return_string)
    return return_string + ref

def to_dec_deg(input_string):
    deg, minutes, seconds, direction = re.split('[°\'"]', input_string)
    return (float(deg) + float(minutes)/60 + float(seconds)/(60*60)) * (-1 if direction in ['W', 'S'] else 1)

def prompt_for_coordinates():
    coord_input = input("Enter coordinates in format: lat, lng (e.g., 40.23123, 12.21314): ").strip()
    try:
        lat_str, lon_str = map(str.strip, coord_input.split(","))
        return float(lat_str), float(lon_str)
    except (ValueError, IndexError):
        print("Invalid input. Please enter coordinates as: 55.123123, 12.123123")
        sys.exit(1)

def clean_and_resize_image(image_path, width=1920):
    try:
        with PILImage.open(image_path) as img:
            # Calculate new height preserving aspect ratio
            w_percent = width / float(img.width)
            height = int((float(img.height) * float(w_percent)))

            # Resize and strip EXIF
            img = img.resize((width, height), PILImage.LANCZOS)
            img_no_exif = PILImage.new(img.mode, img.size)
            img_no_exif.putdata(list(img.getdata()))
            img_no_exif.save(image_path)
            print(f"Image resized to {width}px wide and EXIF removed: {image_path}")
    except Exception as e:
        print(f"Failed to process image: {e}")
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Usage: script.py <image_file>")
        sys.exit(1)

    filename = sys.argv[1]

    quote = input("Enter the quote: ").strip()
    authors_input = input("Enter comma-separated author names (default: SPYO): ").strip()
    authors = [author.strip() for author in authors_input.split(",") if author.strip()] if authors_input else ["SPYO"]

    with open(filename, 'rb') as image_file:
        try:
            image = ExifImage(image_file)
            lat_deg, lat_sec, lat_min = image.gps_latitude
            lat_ref = image.gps_latitude_ref

            lon_deg, lon_sec, lon_min = image.gps_longitude
            lon_ref = image.gps_longitude_ref

            lat_formatted = format_dms(lat_deg, lat_sec, lat_min, lat_ref)
            lon_formatted = format_dms(lon_deg, lon_sec, lon_min, lon_ref)

            lat_dec_deg = to_dec_deg(lat_formatted)
            lon_dec_deg = to_dec_deg(lon_formatted)
        except:
            print("No GPS data found in the image.")
            lat_dec_deg, lon_dec_deg = prompt_for_coordinates()

    # Resize and strip EXIF
    clean_and_resize_image(filename)

    new_entry = {
        quote: {
            "lat": round(lat_dec_deg, 6),
            "lng": round(lon_dec_deg, 6),
            "authors": authors,
            "image": filename
        }
    }

    # Load existing data
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = {}
    else:
        existing_data = {}

    # Add and sort quotes alphabetically
    existing_data.update(new_entry)
    sorted_data = dict(sorted(existing_data.items(), key=lambda item: item[0].lower()))

    # Write updated JSON with minimal diff noise
    with open(DATA_FILE, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(sorted_data, f, indent=4, separators=(',', ': '))
        f.write('\n')

    print(f"Inserted new quote and updated {DATA_FILE}.")

if __name__ == '__main__':
    main()
