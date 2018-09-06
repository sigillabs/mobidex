import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import * as styles from '../../styles';
import Button from './Button';

export default class MaxButton extends Component {
  render() {
    const {
      buttonProps,
      buttonStyle,
      containerProps,
      containerStyle,
      onPress,
      titleStyle
    } = this.props;
    return (
      <TouchableOpacity
        onPress={() => this.toggleShow()}
        style={[styles.flex0, containerStyle]}
        {...containerProps}
      >
        <Button
          onPress={onPress}
          title={'max'}
          titleStyle={[style.title, titleStyle]}
          buttonStyle={[style.button, buttonStyle]}
          disabledStyle={[style.button, style.disabled, buttonStyle]}
          {...buttonProps}
        />
      </TouchableOpacity>
    );
  }
}

const style = {
  button: {
    backgroundColor: styles.colors.transparent,
    borderColor: styles.colors.primary,
    borderRadius: 3,
    borderWidth: 1,
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
    backgroundColor: styles.colors.transparent,
    color: styles.colors.primary
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
