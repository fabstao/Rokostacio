#!/bin/bash

FOREVER=/usr/bin/forever
DIR=~/src/nodejs/rokostacio

cd ${DIR}
${FOREVER} start -c "node --max-old-space-size=256" -o out.log -e error.log bin/www

echo "Listo"

