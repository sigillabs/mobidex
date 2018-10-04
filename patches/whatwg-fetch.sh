#!/bin/bash

find ./node_modules -name fetch.umd.js -print -exec sed -i.bk 's/self/global/g' {} \;