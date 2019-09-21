import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import * as AssetService from '../../../../services/AssetService';
import {styles} from '../../../../styles';
import BigCenter from '../../../components/BigCenter';

export default class UnlockToken extends Component {
  static get propTypes() {
    return {
      tokenAddress: PropTypes.string.isRequired,
    };
  }

  render() {
    const {name} = AssetService.findAssetByAddress(this.props.tokenAddress);

    return (
      <BigCenter style={[styles.h100, styles.w100]}>
        <Entypo name="lock" size={100} color="black" style={styles.mh2} />
        <Text>{name} must be unlocked to see more.</Text>
      </BigCenter>
    );
  }
}
