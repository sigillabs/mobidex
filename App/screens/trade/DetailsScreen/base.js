import PropTypes from 'prop-types';
import React, {Component} from 'react';
import * as AssetService from '../../../../services/AssetService';
import {addressProp} from '../../../../types/props';
import EthereumDetails from './EthereumDetails';
import TokenDetails from './TokenDetails';

export default class DetailsScreen extends Component {
  static get propTypes() {
    return {
      tokenAddress: PropTypes.oneOfType([
        addressProp,
        PropTypes.instanceOf(null),
      ]).isRequired,
    };
  }

  render() {
    if (AssetService.isEthereum(this.props.tokenAddress)) {
      return <EthereumDetails {...this.props} />;
    } else {
      return <TokenDetails {...this.props} />;
    }
  }
}
