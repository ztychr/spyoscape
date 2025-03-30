image: SHELL:=/bin/bash   # HERE: this is setting the shell for b only
image:
	exiftool -all:all= $(IMG) -overwrite_original
	mogrify -resize 1920 $(IMG)
