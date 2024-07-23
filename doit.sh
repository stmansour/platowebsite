#!/bin/bash

# Output file (you can change this to redirect to your downloads.html or another file)
OUTPUT_FILE="generated_files.js"

# Start the JavaScript table
echo "const files = [" > $OUTPUT_FILE

# Determine the checksum command based on the OS
if [[ "$(uname)" == "Darwin" ]]; then
    CHECKSUM_CMD="shasum -a 256"
else
    CHECKSUM_CMD="sha256sum"
fi

# Loop through each tar.gz file
for file in downloads/*.tar.gz; do
    # Extract the base name without the path
    base_name=$(basename "$file")

    # Calculate the SHA256 hash
    hash=$($CHECKSUM_CMD "$file" | awk '{print $1}')

    # Extract version information from the file name
    if [[ $base_name =~ plato\.([0-9]+\.[0-9]+)-[0-9T]+\..* ]]; then
        version="${BASH_REMATCH[1]}"
        title="Plato - ver $version"
    elif [[ $base_name =~ simq\.([0-9]+\.[0-9]+)-[0-9T]+\..* ]]; then
        version="${BASH_REMATCH[1]}"
        title="SimQ - ver $version"
    else
        title="Unknown"
    fi

    # Append to the JavaScript table
    echo "    {" >> $OUTPUT_FILE
    echo "        title: \"$title\"," >> $OUTPUT_FILE
    echo "        filePath: \"$base_name\"," >> $OUTPUT_FILE
    echo "        hash: \"$hash\"" >> $OUTPUT_FILE
    echo "    }," >> $OUTPUT_FILE
done

# End the JavaScript table
echo "];" >> $OUTPUT_FILE

# Print the result to the terminal (optional)
cat $OUTPUT_FILE

