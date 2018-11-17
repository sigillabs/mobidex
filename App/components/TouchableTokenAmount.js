import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import TokenAmount from './TokenAmount';

export default class TouchableTokenAmount extends Component {
  static get propTypes() {
    return {
      onPress: PropTypes.func,
      containerStyle: PropTypes.object
    };
  }

  render() {
    const { containerStyle, onPress } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, containerStyle]}
      >
        <TokenAmount {...this.props} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    height: 60
  }
});
