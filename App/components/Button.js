import React, { Component } from 'react';
import { Button as RNEButton } from 'react-native-elements';
import * as styles from '../../styles';

export default class Button extends Component {
  render() {
    let { titleStyle, buttonStyle, loadingStyle, ...rest } = this.props;
    return (
      <RNEButton
        {...rest}
        titleStyle={[style.title, titleStyle]}
        buttonStyle={[style.button, buttonStyle]}
        disabledStyle={[style.button, style.disabled, buttonStyle]}
        loadingStyle={[styles.margin2, loadingStyle]}
      />
    );
  }
}

const style = {
  button: {
    backgroundColor: styles.colors.yellow0,
    borderColor: styles.colors.yellow0,
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
