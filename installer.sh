#!/bin/bash

FOLDER="./Installer/archive"
BRANCH="master"

# Loop over all .zip.* files, safely handling spaces
find "$FOLDER" -maxdepth 1 -type f -name "Project SDSG.part.zip.*" | sort -V | while IFS= read -r file; do
    echo "Processing '$file'..."

    git add "$file"
    filename=$(basename "$file")
    git commit -m "Add '$filename'"
    git push origin "$BRANCH"

    echo "'$filename' pushed successfully."
done

echo "All .part files committed and pushed individually."