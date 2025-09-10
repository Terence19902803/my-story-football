#!/bin/bash
set -e

echo "🔧 Correction des réglages de signature dans Pods & Capacitor..."

PROJECT_FILE="ios/App/App.xcodeproj/project.pbxproj"

# Supprimer les réglages de signature forcés dans Pods et Capacitor
sed -i.bak '/CODE_SIGN_STYLE = Manual;/d' $PROJECT_FILE
sed -i.bak '/CODE_SIGN_IDENTITY = "Apple Distribution";/d' $PROJECT_FILE
sed -i.bak '/PROVISIONING_PROFILE_SPECIFIER =/d' $PROJECT_FILE
sed -i.bak '/DEVELOPMENT_TEAM =/d' $PROJECT_FILE

echo "✅ Nettoyage terminé : seul le target principal 'App' garde la signature."
