import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../styles';

export default class NumberOverlay extends Component {
  render() {
    return (
      <View>
        <View>{this.props.children}</View>
        <View style={[styles.overlay, styles.circle]}>
          <Text style={[styles.text]}>{this.props.value}</Text>
        </View>
      </View>
    );
  }
}

NumberOverlay.propTypes = {
  children: PropTypes.any,
  value: PropTypes.number.isRequired
};

const styles = {
  overlay: {
    position: 'absolute'
  },
  circle: {
    backgroundColor: colors.background,
    borderColor: colors.yellow0,
    borderWidth: 1,
    borderRadius: 5,
    height: 10,
    width: 10
  },
  text: {
    color: colors.yellow0,
    fontSize: 8,
    textAlign: 'center'
  }
};
