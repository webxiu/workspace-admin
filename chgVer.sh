#!/bin/bash

strVersion=$(sed -n '/version/p' ./package.json)

array=(${strVersion//:/})

strVer=$(echo ${array[1]} | sed 's/^"\(.*\)".*/\1/')
array2=(${strVer//./ })
newVer='  "version": "'${array2[0]}"."${array2[1]}"."$((array2[2]+1))'",'
sed -i "s/${strVersion}/${newVer}/" ./package.json
