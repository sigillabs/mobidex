import ethUtil from 'ethereumjs-util';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { summarizeAddress } from '../../lib/utils';

export default class AddressText extends Component {
  render() {
    const {
      address,
      containerStyle,
      leftStyle,
      rightStyle,
      summarize
    } = this.props;
    return (
      <Text style={[containerStyle]}>
        <Text style={[leftStyle]}>0x</Text>
        <Text style={[rightStyle]}>
          {summarize
            ? summarizeAddress(address).substring(2)
            : ethUtil.stripHexPrefix(address)}
        </Text>
      </Text>
    );
  }
}

AddressText.propTypes = {
  address: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
  leftStyle: PropTypes.object,
  rightStyle: PropTypes.object,
  summarize: PropTypes.bool
};
