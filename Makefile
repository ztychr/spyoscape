image: SHELL:=/bin/bash   # HERE: this is setting the shell for b only
image:
	exiftool -all:all= -r ./static/images/ -overwrite_original
	for i in ./static/images/*.jpg; do \
		mogrify -resize 1920 $$i; \
	done
