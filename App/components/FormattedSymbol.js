import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text} from 'react-native-elements';
import {formatSymbol} from '../../lib/utils';
import * as AssetService from '../../services/AssetService';

export default class FormattedSymbol extends Component {
  static get propTypes() {
    return {
      address: PropTypes.string,
      symbol: PropTypes.string,
    };
  }

  render() {
    const {address, symbol, ...rest} = this.props;
    if (symbol) {
      return <Text {...rest}>{formatSymbol(symbol)}</Text>;
    } else {
      const token = AssetService.findAssetByAddress(address);
      return <Text {...rest}>{formatSymbol(token.symbol)}</Text>;
    }
  }
}
