#!/usr/bin/env bash

set -e

echo "🔧 Post-clone script running..."

cd ios

# Installer CocoaPods si nécessaire
if ! command -v pod &> /dev/null
then
    echo "Installing CocoaPods..."
    gem install cocoapods
fi

# Installer les pods
echo "Installing pods..."
pod install

echo "✅ Post-clone script finished!"
