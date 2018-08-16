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
        {!this.props.hideOnZero || this.props.value > 0 ? (
          <View
            style={[
              styles.overlay,
              styles.circle,
              this.props.orientation === 'right' ? styles.right : styles.left
            ]}
          >
            <Text style={[styles.text]}>{this.props.value}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

NumberOverlay.propTypes = {
  children: PropTypes.any,
  value: PropTypes.number.isRequired,
  orientation: PropTypes.string.isRequired,
  hideOnZero: PropTypes.bool.isRequired
};

NumberOverlay.defaultProps = {
  orientation: 'left',
  hideOnZero: true
};

const styles = {
  overlay: {
    position: 'absolute'
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
  },
  left: {
    left: -10
  },
  right: {
    right: -10
  }
};
