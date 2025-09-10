#!/bin/bash
set -e

echo "🔧 Configuration du projet iOS pour Codemagic..."

# Nettoyage des réglages de signature automatique
/usr/libexec/PlistBuddy -c "Delete :TargetAttributes:1:ProvisioningStyle" "ios/App/App.xcodeproj/project.pbxproj" || true
/usr/libexec/PlistBuddy -c "Add :TargetAttributes:1:ProvisioningStyle string Manual" "ios/App/App.xcodeproj/project.pbxproj" || true

# Forcer le provisioning profile uniquement pour le target App
/usr/libexec/PlistBuddy -c "Delete :PROVISIONING_PROFILE_SPECIFIER" "ios/App/App.xcodeproj/project.pbxproj" || true
/usr/libexec/PlistBuddy -c "Add :PROVISIONING_PROFILE_SPECIFIER string $PROFILE_SPECIFIER" "ios/App/App.xcodeproj/project.pbxproj" || true

# Forcer le style de signature
/usr/libexec/PlistBuddy -c "Delete :CODE_SIGN_STYLE" "ios/App/App.xcodeproj/project.pbxproj" || true
/usr/libexec/PlistBuddy -c "Add :CODE_SIGN_STYLE string Manual" "ios/App/App.xcodeproj/project.pbxproj" || true

# Définir le team ID
/usr/libexec/PlistBuddy -c "Delete :DEVELOPMENT_TEAM" "ios/App/App.xcodeproj/project.pbxproj" || true
/usr/libexec/PlistBuddy -c "Add :DEVELOPMENT_TEAM string $TEAM_ID" "ios/App/App.xcodeproj/project.pbxproj" || true

# Définir l’identité de signature
/usr/libexec/PlistBuddy -c "Delete :CODE_SIGN_IDENTITY" "ios/App/App.xcodeproj/project.pbxproj" || true
/usr/libexec/PlistBuddy -c "Add :CODE_SIGN_IDENTITY string Apple\ Distribution" "ios/App/App.xcodeproj/project.pbxproj" || true

echo "✅ Configuration terminée avec succès !"
