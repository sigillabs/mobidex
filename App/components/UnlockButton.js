import PropTypes from 'prop-types';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { connect as connectNavigation } from '../../navigation';
import * as AssetService from '../../services/AssetService';
import { approve } from '../../thunks';
import { navigationProp } from '../../types/props';
import { formatSymbol } from '../../utils';
import Button from './Button';

class UnlockButton extends React.Component {
  static propTypes = {
    navigation: navigationProp.isRequired,
    assetData: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const { assetData, dispatch, ...rest } = this.props;
    const asset = AssetService.findAssetByData(assetData);

    return (
      <Button
        icon={<FontAwesome name="lock" size={20} color="white" />}
        title={`Unlock ${formatSymbol(asset.symbol)}`}
        {...rest}
        onPress={this.toggleApprove}
      />
    );
  }

  toggleApprove = () => {
    const { assetData } = this.props;
    const asset = assetData
      ? AssetService.findAssetByData(assetData)
      : AssetService.getWETHAsset();

    this.props.dispatch(
      approve(this.props.navigation.componentId, asset.assetData)
    );
  };
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(connectNavigation(UnlockButton));
