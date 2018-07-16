import React, { Component } from 'react';
import { Button as RNEButton } from 'react-native-elements';
import { colors } from '../../styles';

export default class Button extends Component {
  render() {
    let { titleStyle, buttonStyle, ...rest } = this.props;
    return (
      <RNEButton
        {...rest}
        titleStyle={[styles.title, titleStyle]}
        buttonStyle={[styles.button, buttonStyle]}
        disabledStyle={[styles.button, styles.disabled, buttonStyle]}
      />
    );
  }
}

const styles = {
  button: {
    backgroundColor: colors.yellow0,
    borderColor: colors.yellow0,
    borderRadius: 0,
    borderWidth: 1,
    marginTop: 5,
    marginRight: 5,
    marginBottom: 5,
    marginLeft: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  disabled: {
    opacity: 0.7
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white'
  }
};
