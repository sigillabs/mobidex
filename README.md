# Mobidex

![animated preview](https://github.com/sigillabs/mobidex/raw/master/images/previews/animated/10-06-2018T13-57-49.gif)

## Table of Contents

- [Setup](#setup)
  - [Windows Specific Setup](#windows-specific-setup)
  - [Mac OS X Specific Setup](#mac-os-x-specific-setup)
  - [Linux Specific Setup](#linux-specific-setup)
  - [Platform Setup](#platform-setup)
    - [iOS](#ios)
    - [Android](#android)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm patch](#npm-test)
- [Notes](#notes)

## Setup

```
npm i -g react-native-cli
npm i
```

System Dependencies:

- node > 8.6.0 and < 11
- g++
- Android Studio
- XCode 10+

### Windows Specific Setup

Install git:

- Download from the [official site.](https://git-scm.com/download/win)

Install chocolatey package manager:

- Follow the official guide in [Install page.](https://chocolatey.org/install)

Using [chocolatey](https://chocolatey.org/install), run the following:

```
cinst nodejs.install --version 8.6.0
```

> Hint: Don't forget to do `npm init` to generate profile.json.

after the install has finished, run the following into the command line with **administration execution**:

```
npm install -g --production windows-build-tools
```

> Hint: Don't forget to install node-cli, node-gyp packages using `npm install -g node-cli node-gyp` if it's not installed.

### Mac OS X Specific Setup

Install xcode command line tools:

```
xcode-select --install
```

Using [homebrew](https://brew.sh/), run the following:

```
brew install node
```

### Linux Specific Setup

#### For Ubuntu, debian distros/based distros:

You will need to install build tools and curl, git:

```
$ sudo apt-get install -y build-essential curl git
```

Install node 8.x using [NodeSource](https://nodesource.com/) repository:

```
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

#### For RHEL, CentOS and Fedora distros/based distros:

You will need to install build tools and curl, git:

```
$ sudo dnf -y groupinstall 'Development Tools' && sudo dnf -y install curl git
```

Install node 8.x using [NodeSource](https://nodesource.com/) repository:

```
$ curl -sL https://rpm.nodesource.com/setup_8.x | sudo -E bash -
$ sudo dnf -y install nodejs
```

> Hints:<br />
> Don't forget to install node-cli, node-gyp packages using `$ npm install -g node-cli node-gyp` if it's not installed.<br />
> Don't forget to do `npm init` to generate profile.json.

## Platform Setup

### iOS

> Note: Can only be done on a Mac OS X Specific Setup

Additional Requirements

- [bundler](https://bundler.io)

To run Mobidex on the iOS simulator from XCode, follow these steps.

1. From the Mobidex root  directory, install all the required javascript packages.

  `npm install`

2. Install all the required gems in your project space.  

  > This command will change to the iOS working directory to setup the required Ruby gems in your local project.

  `pushd ios && bundle install --path .gems && bundle exec pod install && popd`

3.  Open `ios/mobidex.xcworkspace` in XCode

4.  Select **Build Settings** for `Pods > secp256k1_swift` target and do the following:
    > Tip: You'll notice there are 2  pods with similar names, we are only working with the one that has the underscore 'secp256k1_swift'

    - Find and set **Use Header Maps** to "No"
    - Find **Header Search Paths**
      - add `"${PODS_ROOT}/secp256k1_swift/Classes"` with `non-recursive`
      - add `"${PODS_ROOT}/secp256k1_swift/Classes/secp256k1/include"` with `non-recursive`


5.  Select **Build Phases** for `Pods > secp256k1_swift` target, move `Headers` section up to the top.

6.  Select **Build Settings** for `Pods > Web3` target, find and set **Swift Language Version** to `Swift 4`

7.  Lastly, select **Build Settings** for `Pods > web3swift` target, find and set **Swift Language Version** to `Swift 5`

Then, select your device simulator of choice and click the **play** icon at the top left corner of Xcode.

### Android

Start develop in Android:

 0. Make sure your system is setup for react-native.
 1. install dependencies of project using yarn with command `yarn` or npm `npm install`.
 2. Connect the smartphone or start the your favorite emulator.
 3. Run the comand `react-native run-android` to compile and run the install project in android.
 4. Run the command `sudo rm -r node_modules/web3-contracts-loader/node_modules/web3`
 5. Run the command `sudo cp -R node_modules/web3/ node_modules/web3-contracts-loader/node_modules/`
 6. Run the command `react-native start` to run server js and loading the MobiDex app.


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

1. Click _New Issue_
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

- https://gist.github.com/parshap/e3063d9bf6058041b34b26b7166fd6bd
- https://medium.com/@aakashns/using-core-node-js-modules-in-react-native-apps-64acd4d07140

### Key management, Cryptography, and Authentication

#### iOS

Keys are stored on disk and unlocked using a passcode. Passcode can be provided or unlocked using touch ID. Touch ID unlock is provided through the Keychain services and [LocalAuthentication](https://developer.apple.com/documentation/localauthentication/).

#### Android

Keys are stored on disk and unlocked using a passcode. Passcode can be provided or unlocked using touch ID. Touch ID unlock is provided through the [Keystore](https://developer.android.com/training/articles/keystore).

# License

[AGPL](https://www.gnu.org/licenses/agpl.html)
