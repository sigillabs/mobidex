import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export default class DismissableKeyboard extends Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {this.props.children}
      </TouchableWithoutFeedback>
    );
  }
}

DismissableKeyboard.propTypes = {
  children: PropTypes.any
};
