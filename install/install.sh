#!/bin/bash
npm install convnetjs
if [ "$(uname)" == "Darwin" ]; then
	xcode-select --install
	brew link --overwrite libpng
	brew install pixman
    brew install cairo
    export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:/opt/X11/lib/pkgconfig
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
	sudo apt-get update
	sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
fi
npm install canvas
