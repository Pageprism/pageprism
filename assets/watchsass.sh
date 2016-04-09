#!/bin/sh
FORMAT=$(echo -e "\033[1;33m%w%f\033[0m written")
SASS="sassc -m -t expanded sass/importAll.sass css/esamizdat.css"

$SASS
while inotifywait -qre close_write --format "$FORMAT" .
do
  $SASS
done

