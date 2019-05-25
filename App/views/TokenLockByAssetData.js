import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as AssetService from '../../services/AssetService';
import { WalletService } from '../../services/WalletService';

export default class TokenLockByAssetData extends Component {
  static propTypes = {
    assetData: PropTypes.string
  };

  static defaultProps = {
    showSymbol: true
  };

  render() {
    const { assetData } = this.props;
    const asset = AssetService.findAssetByData(assetData);

    if (!asset) {
      return <Icon color="white" {...this.props} name="lock" size={20} />;
    }

    const isUnlocked = WalletService.instance.isUnlockedByAssetData(
      asset.assetData
    );

    if (isUnlocked) {
      return <Icon color="white" {...this.props} name="unlock" size={20} />;
    } else {
      return <Icon color="white" {...this.props} name="lock" size={20} />;
    }
  }
}
