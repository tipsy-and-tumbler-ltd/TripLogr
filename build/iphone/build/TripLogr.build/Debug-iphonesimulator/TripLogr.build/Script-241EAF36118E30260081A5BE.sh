#!/bin/sh
if [ "x$TITANIUM_CLI_XCODEBUILD" == "x" ]; then
    /usr/local/bin/node "/usr/local/bin/titanium" build --platform iphone --sdk "3.3.1.v20140718152512" --no-prompt --no-progress-bars --no-banner --no-colors --build-only --xcode
    exit $?
else
    echo "skipping pre-compile phase"
fi
