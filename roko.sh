#!/bin/bash

forever start -c "node --max-old-space-size=256" -o out.log -e error.log src/nodejs/rokostacio/bin/www

