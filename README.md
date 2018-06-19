# Mobidex

## Table of Contents

* [Setup](#setup)
  * [Mac OS X Specific Setup]($mac-os-x-specific-setup)
* [Available Scripts](#available-scripts)
  * [npm start](#npm-start)
  * [npm patch](#npm-test)
* [Notes](#notes)

## Setup

```
npm i -g react-native-cli
npm i
```

System Dependencies:

* node 8.6.0 or newer
* g++

### Mac OS X Specific Setup

Install xcode command line tools:

```
xcode-select --install
```

Using [homebrew](https://brew.sh/), run the following:

```
brew install node
```

### iOS

Run Mobidex from XCode to use the simulator. First do the following:

1.  `pushd ios && pod install && popd`
2.  Open `ios/mobidex.xcworkspace` in XCode
3.  Go to **Build Settings** for Pods > libsodium and disable **Use Header Maps**

Then, click the **play** icon at the top.

### Android

Run Mobidex in an Android emulator:

1.  Open android studio and import mobidex from the `android` directory
2.  Comment out `android.enableAapt2=false` in `gradle.properties`
3.  Sync gradle files
4.  Click play!

* Remember to start virtual device from android studio. More information can be found here: https://developer.android.com/studio/run/managing-avds.

## Available Scripts

### `npm start`

Runs your app in development mode.

Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

```
npm start -- --reset-cache
# or
yarn start -- --reset-cache
```

### `npm run patch`

Patches isomorphic-fetch for use with react-native.

### `npm run build:android:release`

This will construct a signed android release. This is the preferred method of constructing an APK at the moment.

NOTE: Make sure `gradle.properties` has `android.enableAapt2=false`. Otherwise, the build will fail with:

```
mobidex/android/app/build/intermediates/res/merged/release/drawable-hdpi/node_modules_reactnavigation_src_views_assets_backicon.png: error: uncompiled PNG file passed as argument. Must be compiled first into .flat file..
error: failed parsing overlays.
```

## Release

### Android

Run `npm run build:android:release`. See notes above.

### iOS

1.  Open mobidex in XCode
2.  Archive App
3.  Upload app to app store

## Notes

### Web3 and 0x.js

Web3.js does not load because of its dependence on node.js standard libraries. The majority of them are loaded via the `node-libs-react-native` library. In particular, the `crypto` library requires the `vm` library, which cannot be easily mocked or replaced. To circumvent this, I've forked `node-libs-react-native` and added a browserified crypto library: https://github.com/abec/node-libs-react-native.

See the for more details:

* https://gist.github.com/parshap/e3063d9bf6058041b34b26b7166fd6bd
* https://medium.com/@aakashns/using-core-node-js-modules-in-react-native-apps-64acd4d07140
