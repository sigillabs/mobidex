import { assetDataUtils } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as AssetService from '../../../../services/AssetService';
import * as WalletService from '../../../../services/WalletService';
import Approve from './Approve';
import Disapprove from './Disapprove';

export default class BaseToggleApprovalScreen extends Component {
  render() {
    const asset = this.props.asset;
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

BaseToggleApprovalScreen.propTypes = {
  asset: PropTypes.object
};
