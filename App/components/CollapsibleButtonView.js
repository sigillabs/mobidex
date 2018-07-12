import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import * as styles from '../../styles';
import Button from './Button';

export default class CollapsibleButtonView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      animation: new Animated.Value(0)
    };
  }

  render() {
    const {
      buttonTitle,
      buttonWidth,
      overlayStyle,
      containerStyle,
      buttonProps,
      onPress
    } = this.props;
    return (
      <View style={[styles.flex1, styles.row, containerStyle]}>
        <TouchableOpacity
          onPress={() => this.toggleShow()}
          style={[styles.flex1, overlayStyle]}
        >
          {this.props.children}
        </TouchableOpacity>
        <Animated.View style={[styles.flex0, { width: this.state.animation }]}>
          <Button
            title={buttonTitle}
            style={[{ height: '100%' }, styles.fluff0]}
            buttonStyle={[
              { width: buttonWidth, height: '100%' },
              styles.fluff0
            ]}
            onPress={onPress}
            {...buttonProps}
          />
        </Animated.View>
      </View>
    );
  }

  toggleShow() {
    const show = !this.state.show;
    this.setState({ show });
    Animated.timing(this.state.animation, {
      toValue: show ? this.props.buttonWidth : 0,
      duration: 500
    }).start();
  }
}

CollapsibleButtonView.propTypes = {
  buttonTitle: PropTypes.string.isRequired,
  buttonWidth: PropTypes.number.isRequired,
  children: PropTypes.any.isRequired,

  onPress: PropTypes.func,

  overlayStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  buttonProps: PropTypes.object
};
