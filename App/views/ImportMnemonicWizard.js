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
import WizardNavigation from '../components/WizardNavigation';
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

  componentDidMount() {
    this.setState({ mnemonic: this.props.defaultMnemonic });
  }

  render() {
    return (
      <View style={{ marginTop: 50, flex: 1, alignItems: 'center' }}>
        <MnemonicInput
          onChange={words => this.setState({ mnemonic: words })}
          onSubmit={() => this.submit()}
        />
        <View>
          {this.state.mnemonicError ? (
            <Text style={{ color: colors.error }}>
              Mnemonic must be 12 english words.
            </Text>
          ) : (
            <Text style={{ color: colors.error }}> </Text>
          )}
        </View>
        <Button large title="Next" onPress={() => this.submit()} />
        <View style={{ flex: 2 }} />
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
              flex: 3,
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
          onChange={value => this.setPin(value)}
          onSubmit={() => this.submit()}
          buttonTitle={'Import'}
        />
      </View>
    );
  }

  async setPin(value) {
    let current = this.state.pin.slice();
    if (current.length > 6) {
      this.setState({ pin: '', pinError: false });
    } else {
      if (isNaN(value)) {
        if (value === 'back') {
          current = current.slice(0, -1);
        } else {
          current += value;
        }
      } else {
        current += value;
      }

      this.setState({ pin: current, pinError: false });

      if (current.length === 6) {
        this.state.pin = current;
        this.submit();
      }
    }
  }

  submit() {
    if (this.state.pin.length < 6) {
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
      mnemonic: 'a a a a a a a a a a a a',
      pin: '111111',
      page: 0
    };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {this.state.page === 0 ? (
          <MnemonicPage
            defaultMnemonic={this.state.mnemonic}
            onSubmit={mnemonic => this.submitMnemonic(mnemonic)}
          />
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
