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
    position: 'absolute',
    left: -5
  },
  circle: {
    backgroundColor: colors.yellow0,
    borderColor: colors.yellow0,
    borderWidth: 1,
    borderRadius: 8,
    height: 15,
    width: 15
  },
  text: {
    color: colors.background,
    fontSize: 10,
    textAlign: 'center',
    padding: 1
  }
};
