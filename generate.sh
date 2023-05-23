#!/bin/bash
for file in input/*.pot
do
   base=`basename $file .pot`
   node index.js $base
done

for file in output/*.po
do
   base=`basename $file .po`
   msgfmt -o output/$base.mo $file
done