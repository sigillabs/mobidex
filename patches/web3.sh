#!/bin/bash

utils=$( find ./node_modules -name utils.js | grep "web3/lib/utils" )
for f in ${utils}; do
  sed -i.bk -E "s|object.constructor.name === 'BigNumber'|object.s !== undefined \&\& object.e !== undefined \&\& object.c !== undefined|" ${f};
done;
