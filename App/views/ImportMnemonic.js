import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { importPrivateKey } from '../../thunks';
import Button from '../components/Button';
import LongInput from '../components/LongInput';
import BigCenter from '../components/BigCenter';
import * as WalletService from '../services/WalletService';

@reactMixin.decorate(TimerMixin)
export default class ImportMnemonic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mnemonic: '',
      mnemonicError: false,
      password: '',
      passwordError: false
    };
  }

  render() {
    return (
      <BigCenter style={{ width: '100%' }}>
        <LongInput
          secureTextEntry={false}
          placeholder="12-Word Mnemonic"
          onChangeText={value => this.onSetMnemonic(value)}
          errorMessage={
            this.state.mnemonicError
              ? 'The mnemonic you entered is incorrect. Please enter your 12-word mnemonic.'
              : null
          }
          errorStyle={{ color: 'red' }}
          leftIcon={<Icon name="vpn-key" size={12} color="black" />}
          containerStyle={{ width: '100%', marginBottom: 10 }}
        />
        <LongInput
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={value => this.onSetPassword(value)}
          errorMessage={
            this.state.passwordError
              ? 'Wrong or poorly formatted password. Passwords must be at least 6 characters long and must contain both numbers and letters.'
              : null
          }
          errorStyle={{ color: 'red' }}
          leftIcon={<Icon name="person" size={12} color="black" />}
          containerStyle={{ width: '100%', marginBottom: 10 }}
        />
        <Button
          large
          title="Import"
          onPress={() => this.submit()}
          containerStyle={{ width: '100%' }}
        />
      </BigCenter>
    );
  }

  onSetMnemonic(value) {
    this.setState({ mnemonic: value, privateKeyError: false });
  }

  onSetPassword(value) {
    this.setState({ password: value, passwordError: false });
  }

  submit() {
    if (!this.state.mnemonic) {
      this.setState({ mnemonicError: true });
      return;
    }

    if (!this.state.password) {
      this.setState({ passwordError: true });
      return;
    }

    const mnemonicArray = this.state.mnemonic.split(/\s+/);

    if (mnemonicArray.length !== 12) {
      this.setState({ mnemonicError: true });
      return;
    }

    const formattedMnemonic = mnemonicArray.join(' ');

    this.requestAnimationFrame(async () => {
      try {
        const web3 = await WalletService.importMnemonics(
          formattedMnemonic,
          this.state.password
        );
        if (this.props.onFinish) await this.props.onFinish(web3);
      } catch (err) {
        console.warn(err);
        this.setState({ passwordError: true });
        return;
      }
    });
  }
}
