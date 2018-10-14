import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import Button from './Button';

export default class TokenAmountKeyboard extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <VirtualKeyboard
          color="black"
          pressMode="string"
          onPress={val =>
            InteractionManager.runAfterInteractions(() => this.onChange(val))
          }
          decimal={true}
          {...this.props}
        />
        <Button
          large
          title={this.props.buttonTitle}
          icon={this.props.buttonIcon}
          onPress={() => this.onSubmit()}
          containerStyle={{ marginHorizontal: 50, marginTop: 10 }}
          iconRight={this.props.buttonIconRight}
          disabled={this.props.disableButton}
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

TokenAmountKeyboard.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  buttonIcon: PropTypes.node,
  buttonIconRight: PropTypes.bool,
  disableButton: PropTypes.bool
};

TokenAmountKeyboard.defaultProps = {
  buttonTitle: 'Submit',
  disableButton: false
};
