# Mobidex

![animated preview](https://github.com/sigillabs/mobidex/raw/master/images/previews/animated/10-06-2018T13-57-49.gif)

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
* Android Studio
* XCode

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

1.  `pushd ios && bundle install --path .gems && bundle exec pod install && popd`
2.  Open `ios/mobidex.xcworkspace` in XCode
3.  Go to **Build Settings** for Pods > libsodium and disable **Use Header Maps**

Then, click the **play** icon at the top.

### Android

Run Mobidex in an Android emulator:

1.  In the terminal, execute `npm start`.
2.  Open android studio and import mobidex from the `android` directory
3.  Comment out `android.enableAapt2=false` in `gradle.properties`
4.  Sync gradle files
5.  Click play!

* Remember to start virtual device from android studio. More information can be found here: https://developer.android.com/studio/run/managing-avds.

## Available Scripts

### `npm start`

Run the development server which is necessary for debug configurations of the App.

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

### Key management, Cryptography, and Authentication

#### iOS

Keys are stored on disk and unlocked using a passcode. Passcode can be provided or unlocked using touch ID. Touch ID unlock is provided through the Keychain services and [LocalAuthentication](https://developer.apple.com/documentation/localauthentication/).

#### Android

Keys are stored on disk and unlocked using a passcode. Passcode can be provided or unlocked using touch ID. Touch ID unlock is provided through the [Keystore](https://developer.android.com/training/articles/keystore).

# License

[AGPL](https://www.gnu.org/licenses/agpl.html)
