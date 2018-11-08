import { assetDataUtils } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as AssetService from '../../../services/AssetService';
import * as WalletService from '../../../services/WalletService';
import Approve from './Approve';
import Disapprove from './Disapprove';

export default class ToggleApprovalScreen extends Component {
  render() {
    const asset = this.props.navigation.getParam('asset');
    let assetData = asset.assetData;
    if (asset.assetData === null) {
      assetData = AssetService.getWETHAsset().assetData;
    }
    const isUnlocked = WalletService.isUnlockedByAddress(
      assetDataUtils.decodeERC20AssetData(assetData).tokenAddress
    );

    if (isUnlocked) {
      return <Disapprove assetData={assetData} />;
    } else {
      return <Approve assetData={assetData} />;
    }
  }
}

ToggleApprovalScreen.propTypes = {
  navigation: PropTypes.object
};
