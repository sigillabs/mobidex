# Mobidex

![animated preview](https://github.com/sigillabs/mobidex/raw/master/images/previews/animated/10-06-2018T13-57-49.gif)

## Table of Contents

* [Setup](#setup)
  * [Windows Specific Setup]($windows-specific-setup)
  * [Mac OS X Specific Setup]($mac-os-x-specific-setup)
  * [Linux Specific Setup]($linux-specific-setup)
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

* node 8.6.0 or newer (Unfortunately node 11+ are not supported currenctly.)
* g++
* Android Studio
* XCode

### Windows Specific Setup

Install git:
- Download it from the [official site.](https://git-scm.com/download/win)

Install chocolatey as package manager:
- Please Follow the official guide in [Install page.](https://chocolatey.org/install)

Using [chocolatey](https://chocolatey.org/install), run the following:
```
cinst nodejs.install --version 8.6.0
```

> Hint: Don't forget to do ```npm init``` to generate profile.json.

after the install process being completed, run the following into the command line with **administration execution**:
```
npm install -g --production windows-build-tools
```

> Hint: Don't forget to install node-cli, node-gyp packages using ```npm install -g node-cli node-gyp``` if it's not installed.

### Linux Specific Setup

For the node package manager, I suggest you to use [Linuxbrew](https://linuxbrew.sh/).

#### For Ubuntu, debian distros/based distros:

You will need to install build tools and curl, git because you want to compile and install native add-ons from npm:
```
$ sudo apt-get install -y build-essential curl git
```

Install node 8.x using [NodeSource](https://nodesource.com/) repository:
```
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

> Hint: Don't forget to install node-cli, node-gyp packages using ```$ npm install -g node-cli node-gyp``` if it's not installed.

#### For RHEL, CentOS and Fedora distros/based distros:

You will need to install build tools and curl, git because you want to compile and install native add-ons from npm:
```
$ sudo dnf -y groupinstall 'Development Tools' && sudo dnf -y install curl git
```

Install node 8.x using [NodeSource](https://nodesource.com/) repository:
```
$ curl -sL https://rpm.nodesource.com/setup_8.x | sudo -E bash -
$ sudo dnf -y install nodejs
```

> Hint: Don't forget to install node-cli, node-gyp packages using ```$ npm install -g node-cli node-gyp``` if it's not installed.

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

## Contributing

Mobidex is an open source project. As such, there are many ways to contribute. See below to see how you can get involved!

### Submit A Bug

All issues with the Mobidex client are public. They can be found at https://github.com/sigillabs/mobidex/issues.

1. Click *New Issue*
2. Fill in the template
3. Click submit

You can also run the issue by the [telegram](https://t.me/mobidex) group before creating an issue.

### Development

1. Find a **good first [issue](https://github.com/sigillabs/mobidex/issues)**.
2. Submit a pull request.

### Testing

Any one can become a tester. Just join the Mobidex [telegram](https://t.me/mobidex) and ask and admin to join.

## Special Thanks To Our Testers

- [AboShanab](https://github.com/AboShanab)
- [gsampathkumar](https://github.com/gsampathkumar)

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
