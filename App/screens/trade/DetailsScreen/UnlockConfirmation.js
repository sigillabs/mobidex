import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import * as AssetService from '../../../../services/AssetService';
import {fonts, styles} from '../../../../styles';
import TokenIcon from '../../../components/TokenIcon';
import BigCenter from '../../../components/BigCenter';

export default class UnlockConfirmation extends Component {
  static get propTypes() {
    return {
      tokenAddress: PropTypes.string.isRequired,
    };
  }

  render() {
    const {tokenAddress} = this.props;
    const asset = AssetService.findAssetByAddress(tokenAddress);

    return (
      <BigCenter>
        <Entypo name="lock-open" size={100} color="black" style={styles.mh2} />
        <Text>Unlock {asset.name} for swapping.</Text>
      </BigCenter>
    );
  }
}
