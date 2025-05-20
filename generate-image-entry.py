#!/usr/bin/env python3

import sys
import re
import json
from exif import Image

def format_dms(degrees, minutes, seconds, ref):
    return_string = f"{degrees}°{minutes}'{seconds}\""
    return_string = str(return_string.replace(',', '.'))
    return_string = re.sub(r'[() ]', '', return_string)
    return return_string + ref


def to_dec_deg(input_string):
    deg, minutes, seconds, direction =  re.split('[°\'"]', input_string)
    return (float(deg) + float(minutes)/60 + float(seconds)/(60*60)) * (-1 if direction in ['W', 'S'] else 1)


def main():
    filename = sys.argv[1]
    with open(filename, 'rb') as image_file:
        image = Image(image_file)
        lat_deg, lat_sec, lat_min = image.gps_latitude
        lat_ref = image.gps_latitude_ref

        lon_deg, lon_sec, lon_min = image.gps_longitude
        lon_ref = image.gps_longitude_ref
        #
        lat_formatted = format_dms(lat_deg, lat_sec, lat_min, lat_ref)
        lon_formatted = format_dms(lon_deg, lon_sec, lon_min, lon_ref)

        lat_dec_deg = to_dec_deg(lat_formatted)
        lon_dec_deg = to_dec_deg(lon_formatted)

        data = {
            "lat": round(lat_dec_deg, 6),
            "lng": round(lon_dec_deg, 6),
            "name": "<QUOTE>",
            "authors": ["SPYO"],
            "image": "static/images/<PATH TO IMG>"
        }

        print(json.dumps(data, indent=4) + ",")


if __name__ == '__main__':
    main()
