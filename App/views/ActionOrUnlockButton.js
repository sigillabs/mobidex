import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { connect as connectNavigation } from '../../navigation';
import { approve } from '../../thunks';
import * as AssetService from '../../services/AssetService';
import * as WalletService from '../../services/WalletService';
import Button from '../components/Button';

class ActionOrUnlockButton extends React.Component {
  static propTypes = {
    assetData: PropTypes.string.isRequired,
    unlockProps: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
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
    const { assetData } = this.props;
    const assetOrWETH =
      assetData !== null
        ? AssetService.findAssetByData(assetData)
        : AssetService.getWETHAsset();

    this.props.dispatch(
      approve(this.props.navigation.componentId, assetOrWETH.assetData)
    );
  };
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  connectNavigation(ActionOrUnlockButton)
);
