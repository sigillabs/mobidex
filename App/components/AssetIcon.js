import React, {Component} from 'react';
import * as AssetService from '../../services/AssetService';
import {addressProp} from '../../types/props';
import EthereumIcon from './EthereumIcon';
import TokenIcon from './TokenIcon';

export default class AssetIcon extends Component {
  static get propTypes() {
    return {
      address: addressProp,
    };
  }

  static get defaultProps() {
    return {
      address: null,
    };
  }

  render() {
    if (AssetService.isEthereum(this.props.address)) {
      return <EthereumIcon {...this.props} />;
    } else {
      return <TokenIcon {...this.props} />;
    }
  }
}
