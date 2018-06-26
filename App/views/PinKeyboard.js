import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import Button from '../components/Button';

export default class PinKeyboard extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <VirtualKeyboard
          color="black"
          pressMode="character"
          onPress={val => this.onChange(val)}
          decimal={false}
          {...this.props}
        />
        <Button
          large
          title={this.props.buttonTitle}
          onPress={() => this.onSubmit()}
          containerStyle={{ marginHorizontal: 50, marginTop: 10 }}
        />
      </View>
    );
  }

  onChange(value) {
    if (this.props.onChange) this.props.onChange(value);
  }

  onSubmit() {
    if (this.props.onSubmit) this.props.onSubmit();
  }
}

PinKeyboard.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonTitle: PropTypes.string.isRequired
};

PinKeyboard.defaultProps = {
  buttonTitle: 'Unlock'
};
