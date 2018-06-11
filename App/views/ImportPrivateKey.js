import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { importPrivateKey } from '../../thunks';
import Button from '../components/Button';
import LongInput from '../components/LongInput';
import BigCenter from '../components/BigCenter';

@reactMixin.decorate(TimerMixin)
class ImportPrivateKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privateKey: '',
      privateKeyError: false,
      password: '',
      passwordError: false
    };
  }

  render() {
    return (
      <BigCenter style={{ width: '100%' }}>
        <LongInput
          secureTextEntry={true}
          placeholder="Private Key"
          onChangeText={value => this.onSetPrivateKey(value)}
          errorMessage={
            this.state.privateKeyError
              ? "Private key isn't right for some reason. Make sure you've typed it in correctly."
              : null
          }
          errorStyle={{ color: 'red' }}
          icon={<Icon name="vpn-key" size={24} color="black" />}
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
          icon={<Icon name="person" size={24} color="black" />}
          containerStyle={{ width: '100%', marginBottom: 10 }}
        />
        <Button
          large
          title="Import Private Key"
          onPress={() => this.importPrivateKey()}
          containerStyle={{ width: '100%' }}
        />
      </BigCenter>
    );
  }

  onSetPrivateKey(value) {
    this.setState({ privateKey: value, privateKeyError: false });
  }

  onSetPassword(value) {
    this.setState({ password: value, passwordError: false });
  }

  importPrivateKey() {
    if (!this.state.privateKey) {
      this.setState({ privateKeyError: true });
      return;
    }

    if (!this.state.password) {
      this.setState({ passwordError: true });
      return;
    }

    this.requestAnimationFrame(async () => {
      try {
        await this.props.dispatch(
          importPrivateKey(this.state.privateKey, this.state.password)
        );
      } catch (err) {
        this.setState({ passwordError: true });
        return;
      }

      if (this.props.onFinish) await this.props.onFinish();
    });
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(
  ImportPrivateKey
);
