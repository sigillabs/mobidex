import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { formatPercent } from '../../lib/utils';

export default class FormattedPercent extends Component {
  static get propTypes() {
    return {
      percent: PropTypes.oneOfType([
        PropTypes.instanceOf(BigNumber),
        PropTypes.number,
        PropTypes.string
      ]).isRequired
    };
  }

  render() {
    const { percent, ...rest } = this.props;
    return <Text {...rest}>{formatPercent(percent)}</Text>;
  }
}
