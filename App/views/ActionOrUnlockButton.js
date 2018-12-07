import PropTypes from 'prop-types';
import React from 'react';
import { connect as connectNavigation } from '../../navigation';
import * as AssetService from '../../services/AssetService';
import * as WalletService from '../../services/WalletService';
import Button from '../components/Button';

class ActionOrUnlockButton extends React.Component {
  static propTypes = {
    assetData: PropTypes.string.isRequired,
    unlockProps: PropTypes.object.isRequired
  };

  render() {
    if (WalletService.isUnlockedByAssetData(this.props.assetData)) {
      return this.renderBuy();
    } else {
      return this.renderUnlock();
    }
  }

  renderBuy() {
    return <Button {...this.props} />;
  }

  renderUnlock() {
    return (
      <Button
        {...this.props}
        {...this.props.unlockProps}
        onPress={this.toggleApprove}
      />
    );
  }

  toggleApprove = () => {
    const asset = AssetService.findAssetByData(this.props.assetData);
    this.props.navigation.push('navigation.wallet.ToggleApprove', {
      asset
    });
  };
}

export default connectNavigation(ActionOrUnlockButton);
