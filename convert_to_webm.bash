#!/bin/bash
cd sfx
rm -f *.ogg
rm -f *.webm

FILELIST=`ls *.mp3 | sed 's/\(.*\)\..*/\1/'`

# echo $FILELIST

for FILE in $FILELIST
do
	echo "Converting $FILE..."
	ffmpeg -i $FILE.mp3 -aq 4 $FILE.ogg;
	ffmpeg -i $FILE.mp3 -aq 4 $FILE.webm
done

cd ..

touch sfx/*
touch images/*
touch javascript/*
touch css/*
touch index.html

rm -v javascript/*.js~
rm -v javascript/*.json~
rm -v css/*.css~
rm -v images/*.json~
rm -v ./*~

