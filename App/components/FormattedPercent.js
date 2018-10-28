import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { formatPercent } from '../../utils';

export default class FormattedPercent extends Component {
  render() {
    const { percent } = this.props;
    return <Text {...this.props}>{formatPercent(percent)}</Text>;
  }
}

FormattedPercent.propTypes = {
  percent: PropTypes.oneOfType([
    PropTypes.instanceOf(BigNumber),
    PropTypes.number,
    PropTypes.string
  ])
};
