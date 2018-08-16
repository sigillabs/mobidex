import * as _ from 'lodash';
import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { Clipboard, InteractionManager, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../styles';
import Button from '../components/Button';
import MnemonicInput from '../components/MnemonicInput';
import MutedText from '../components/MutedText';
import PinKeyboard from '../components/PinKeyboard';
import PinView from '../components/PinView';
import Row from '../components/Row';
import WizardNavigation from '../components/WizardNavigation';
import * as WalletService from '../services/WalletService';

class MnemonicPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mnemonicError: false
    };
  }

  render() {
    return (
      <View
        style={{
          marginTop: 50,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <MutedText>Enter your 12 word seed phrase.</MutedText>
        <MnemonicInput
          words={this.props.mnemonic}
          onChange={this.props.onChange}
          onSubmit={() => this.submit()}
          containerStyle={{ flex: 0, height: 260, marginTop: 20 }}
        />
        {this.state.mnemonicError ? (
          <Text style={{ color: colors.error }}>
            Mnemonic must be 12 english words.
          </Text>
        ) : (
          <Text style={{ color: colors.error }}> </Text>
        )}
        <Row>
          <Button
            large
            title="Paste"
            onPress={() => this.paste()}
            disabled={this.validate(this.props.mnemonic)}
          />
          <Button
            large
            title="Next"
            onPress={() => this.submit()}
            disabled={!this.validate(this.props.mnemonic)}
          />
        </Row>
      </View>
    );
  }

  validate(mnemonic) {
    return (
      mnemonic &&
      mnemonic.length === 12 &&
      mnemonic.reduce((all, word) => all && Boolean(word), true)
    );
  }

  async paste() {
    const mnemonic = await Clipboard.getString();
    if (this.validate(mnemonic.split(/\s+/))) {
      this.props.onChange(mnemonic.split(/\s+/));
    }
  }

  submit() {
    if (!this.validate(this.props.mnemonic)) {
      this.setState({ mnemonicError: true });
      return;
    }

    this.props.onSubmit();
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
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'flex-end'
            }}
          >
            <MutedText>Provide a PIN to secure your wallet.</MutedText>
          </View>
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
      mnemonic: _.times(12, _.constant('')),
      pin: '',
      page: 0
    };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {this.state.page === 0 ? (
          <MnemonicPage
            mnemonic={this.state.mnemonic}
            onChange={mnemonic => this.onChangeMnemonic(mnemonic)}
            onSubmit={mnemonic => this.submitMnemonic()}
          />
        ) : null}
        {this.state.page === 1 ? (
          <PinPage onSubmit={pin => this.submitPin(pin)} />
        ) : null}
      </View>
    );
  }

  onChangeMnemonic(mnemonic) {
    this.setState({ mnemonic });
  }

  submitMnemonic() {
    this.setState({ page: 1 });
  }

  submitPin(pin) {
    this.state.pin = pin;
    this.setState({ pin, page: 1 });
    this.submit();
  }

  submit() {
    InteractionManager.runAfterInteractions(async () => {
      try {
        const web3 = await WalletService.importMnemonics(
          this.state.mnemonic.join(' '),
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
