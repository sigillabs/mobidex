import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { styles } from '../../../styles';
import PinKeyboard from '../../components/PinKeyboard';
import PinView from '../../components/PinView';
import { push } from '../../../navigation';

class UnlockWithPin extends Component {
  static get propTypes() {
    return {
      error: PropTypes.object,
      showUnlocking: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      pin: '',
      pinError: false
    };
  }

  render() {
    const error = this.props.error || this.state.pinError;

    return (
      <View style={{ flex: 1 }}>
        <View
          style={[styles.bigCenter, { marginHorizontal: 50, marginBottom: 30 }]}
        >
          <PinView
            value={this.state.pin}
            containerStyle={{
              alignItems: 'flex-end',
              marginBottom: 20
            }}
          />
          {error ? (
            <Text style={[styles.top, { color: 'red' }]}>
              Pin incorrect. Try again.
            </Text>
          ) : (
            <Text style={[styles.top, { color: 'red' }]}> </Text>
          )}
        </View>
        <PinKeyboard onChange={this.setPin} />
      </View>
    );
  }

  setPin = value => {
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
        this.setState({ pin: current });
        this.unlock(current);
      }
    }
  };

  unlock = pin => {
    if (pin.length < 6) {
      this.setState({ pinError: true });
      return;
    }

    this.props.showUnlocking(pin.slice(0, 6));
  };
}

export default connect(() => ({}), dispatch => ({ dispatch }))(UnlockWithPin);
