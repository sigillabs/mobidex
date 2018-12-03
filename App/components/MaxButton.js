import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { colors } from '../../styles';
import Button from './Button';

export default class MaxButton extends Component {
  render() {
    const { buttonProps, buttonStyle, onPress, titleStyle } = this.props;
    return (
      <Button
        onPress={onPress}
        title={'max'}
        titleStyle={[style.title, titleStyle]}
        buttonStyle={[style.button, buttonStyle]}
        disabledStyle={[style.button, style.disabled, buttonStyle]}
        {...buttonProps}
      />
    );
  }
}

const style = {
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
};

MaxButton.propTypes = {
  onPress: PropTypes.func,
  containerProps: PropTypes.object,
  containerStyle: PropTypes.object,
  buttonProps: PropTypes.object,
  buttonStyle: PropTypes.object,
  titleStyle: PropTypes.object
};
