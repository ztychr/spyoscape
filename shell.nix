{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.python313Packages.exif
    pkgs.python313Packages.pillow
  ];

  shellHook = ''
    echo 'To add image data, run e.g: python enroll.py static/images/the-beauty-of-ethnicity.jpg '
  '';
}

