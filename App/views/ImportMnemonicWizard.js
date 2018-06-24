import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { View } from 'react-native';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import Button from '../components/Button';
import LongInput from '../components/LongInput';
import MnemonicInput from '../components/MnemonicInput';
import PinView from '../components/PinView';
import BigCenter from '../components/BigCenter';
import * as WalletService from '../services/WalletService';
import PinKeyboard from './PinKeyboard';

class MnemonicPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mnemonic: '',
      mnemonicError: false
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 3 }}>
          <MnemonicInput
            onChange={words => this.setState({ mnemonic: words })}
            onSubmit={() => this.submit()}
          />
        </View>
        <View style={{ flex: 0 }}>
          {this.state.mnemonicError ? (
            <Text style={{ color: colors.error }}>
              Mnemonic must be 12 english words.
            </Text>
          ) : (
            <Text style={{ color: colors.error }}> </Text>
          )}
        </View>
        <View style={{ flex: 3 }} />
        <View style={{ flex: 0 }}>
          <Button
            large
            title="Next"
            onPress={() => this.submit()}
            containerStyle={{ width: '100%' }}
          />
        </View>
      </View>
    );
  }

  submit() {
    if (!this.state.mnemonic) {
      this.setState({ mnemonicError: true });
      return;
    }

    const mnemonicArray = this.state.mnemonic.split(/\s+/);

    if (mnemonicArray.length !== 12) {
      this.setState({ mnemonicError: true });
      return;
    }

    const formattedMnemonic = mnemonicArray.join(' ');

    if (this.props.onSubmit) {
      this.props.onSubmit(formattedMnemonic);
    }
  }
}

class PinPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pin: '',
      pinError: false
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, marginHorizontal: 50 }}>
          <PinView
            value={this.state.pin}
            containerStyle={{
              flex: 4,
              alignItems: 'flex-end',
              marginBottom: 50
            }}
          />
          {this.state.pinError ? (
            <Text style={{ color: 'red', flex: 1 }}>
              Wrong or poorly formatted pin. Pins must be 6 characters long.
            </Text>
          ) : (
            <Text style={{ color: 'red', flex: 1 }}> </Text>
          )}
        </View>
        <PinKeyboard
          onChange={value => this.setState({ pin: value })}
          onSubmit={() => this.submit()}
          buttonTitle={'Import'}
        />
      </View>
    );
  }

  submit() {
    if (!this.state.pin || this.state.pin.length != 6) {
      this.setState({ pinError: true });
      return;
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.pin);
    }
  }
}

@reactMixin.decorate(TimerMixin)
export default class ImportMnemonicWizard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mnemonic: '',
      pin: '',
      page: 0
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.page === 0 ? (
          <MnemonicPage onSubmit={mnemonic => this.submitMnemonic(mnemonic)} />
        ) : null}
        {this.state.page === 1 ? (
          <PinPage onSubmit={pin => this.submitPin(pin)} />
        ) : null}
      </View>
    );
  }

  submitMnemonic(mnemonic) {
    this.setState({ mnemonic, page: 1 });
  }

  submitPin(pin) {
    this.state.pin = pin;
    this.setState({ pin, page: 1 });
    this.submit();
  }

  submit() {
    this.requestAnimationFrame(async () => {
      try {
        const web3 = await WalletService.importMnemonics(
          this.state.mnemonic,
          this.state.pin
        );
        if (this.props.onSubmit) await this.props.onSubmit(web3);
      } catch (err) {
        console.warn(err);
        return;
      }
    });
  }
}

// @reactMixin.decorate(TimerMixin)
// export default class ImportMnemonicWizard extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       mnemonic: '',
//       mnemonicError: false,
//       password: '',
//       passwordError: false
//     };
//   }

//   render() {
//     return (
//       <BigCenter style={{ width: '100%' }}>
//         <MnemonicInput onSubmit={words => this.setState({ mnemonic: words })} />
//         <LongInput
//           secureTextEntry={true}
//           placeholder="Password"
//           onChangeText={value => this.onSetPassword(value)}
//           errorMessage={
//             this.state.passwordError
//               ? 'Wrong or poorly formatted password. Passwords must be at least 6 characters long and must contain both numbers and letters.'
//               : null
//           }
//           errorStyle={{ color: 'red' }}
//           leftIcon={<Icon name="person" size={12} color="black" />}
//           containerStyle={{ width: '100%', marginBottom: 10 }}
//         />
//         <Button
//           large
//           title="Import"
//           onPress={() => this.submit()}
//           containerStyle={{ width: '100%' }}
//         />
//       </BigCenter>
//     );
//   }

//   onSetMnemonic(value) {
//     this.setState({ mnemonic: value, privateKeyError: false });
//   }

//   onSetPassword(value) {
//     this.setState({ password: value, passwordError: false });
//   }

//   submit() {
//     if (!this.state.mnemonic) {
//       this.setState({ mnemonicError: true });
//       return;
//     }

//     if (!this.state.password) {
//       this.setState({ passwordError: true });
//       return;
//     }

//     const mnemonicArray = this.state.mnemonic.split(/\s+/);

//     if (mnemonicArray.length !== 12) {
//       this.setState({ mnemonicError: true });
//       return;
//     }

//     const formattedMnemonic = mnemonicArray.join(' ');

//     this.requestAnimationFrame(async () => {
//       try {
//         const web3 = await WalletService.importMnemonics(
//           formattedMnemonic,
//           this.state.password
//         );
//         if (this.props.onFinish) await this.props.onFinish(web3);
//       } catch (err) {
//         console.warn(err);
//         this.setState({ passwordError: true });
//         return;
//       }
//     });
//   }
// }
