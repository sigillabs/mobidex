#!/bin/bash

find ./node_modules -name fetch-npm-browserify.js -print -exec sed -i.bk 's/self/global/g' {} \;