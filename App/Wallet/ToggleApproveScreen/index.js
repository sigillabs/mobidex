import { assetDataUtils } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as WalletService from '../../../services/WalletService';
import Approve from './Approve';
import Disapprove from './Disapprove';

export default class ToggleApprovalScreen extends Component {
  render() {
    const assetData = this.props.navigation.getParam('assetData');
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
