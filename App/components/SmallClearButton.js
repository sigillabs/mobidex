import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '../../styles';
import { styleProp } from '../../types/props';
import Button from './Button';

export default class SmallClearButton extends Component {
  static get propTypes() {
    return {
      onPress: PropTypes.func,
      buttonStyle: styleProp,
      titleStyle: styleProp
    };
  }

  render() {
    const { buttonStyle, onPress, titleStyle, ...rest } = this.props;
    return (
      <Button
        onPress={onPress}
        titleStyle={[style.title, titleStyle]}
        buttonStyle={[style.button, buttonStyle]}
        disabledStyle={[style.button, style.disabled, buttonStyle]}
        {...rest}
      />
    );
  }
}

const style = StyleSheet.create({
  button: {
    backgroundColor: colors.transparent,
    borderColor: colors.primary,
    borderRadius: 3,
    borderWidth: 1,
    elevation: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0
  },
  disabled: {
    opacity: 0.7
  },
  title: {
    backgroundColor: colors.transparent,
    color: colors.primary
  }
});
