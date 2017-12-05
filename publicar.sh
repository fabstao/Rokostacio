#!/bin/bash

if [ "$#" != "1" ]; then
	echo "Uso: $0 <ip>"
	exit 1
fi
rsync -avrz -e "ssh -C " . $1:~/src/nodejs/rokostacio/ --exclude node_modules/ --exclude uploads/ --exclude public/
