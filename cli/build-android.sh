#!/bin/bash
pushd android

read -sp 'If you would like to sign the APK, please add your store passphrase now: ' MOBIDEX_RELEASE_STORE_PASSWORD
echo ""
if [ -z ${MOBIDEX_RELEASE_STORE_PASSWORD+x} ]; then
  ./gradlew clean assembleRelease -PMOBIDEX_SIGN=0
else
  read -p 'Mobidex keystore path relative to ./android/app (default: ../../mobidex.keystore): ' MOBIDEX_RELEASE_STORE_FILE
  read -p 'Mobidex keystore alias (default: mobidex): ' MOBIDEX_RELEASE_KEY_ALIAS
  echo ""

  # This was just `assembleRelease`. Had to change for react-native-navigation.
  echo "./gradlew clean app:assembleRelease -PMOBIDEX_RELEASE_KEY_ALIAS=${MOBIDEX_RELEASE_KEY_ALIAS+mobidex} -PMOBIDEX_RELEASE_STORE_FILE=${MOBIDEX_RELEASE_STORE_FILE+../mobidex.keystore} -PMOBIDEX_RELEASE_STORE_PASSWORD= -PMOBIDEX_RELEASE_KEY_PASSWORD= -PMOBIDEX_SIGN=1"
  ./gradlew clean app:assembleRelease -PMOBIDEX_RELEASE_KEY_ALIAS=${MOBIDEX_RELEASE_KEY_ALIAS+mobidex} -PMOBIDEX_RELEASE_STORE_FILE=${MOBIDEX_RELEASE_STORE_FILE+../../mobidex.keystore} -PMOBIDEX_RELEASE_STORE_PASSWORD=${MOBIDEX_RELEASE_STORE_PASSWORD} -PMOBIDEX_RELEASE_KEY_PASSWORD=${MOBIDEX_RELEASE_STORE_PASSWORD} -PMOBIDEX_SIGN=1;
fi;

popd android
