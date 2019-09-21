import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {fonts, styles} from '../../../styles';
import {addressProp, BigNumberProp} from '../../../types/props';
import BigCenter from '../../components/BigCenter';
import MutedText from '../../components/MutedText';
import Row from '../../components/Row';
import EthereumAmount from '../../components/EthereumAmount';
import TokenAmount from '../../components/TokenAmount';
import TokenIcon from '../../components/TokenIcon';
import UserIcon from '../../components/UserIcon';

export default class SendConfirmation extends Component {
  static get propTypes() {
    return {
      tokenAddress: addressProp,
      to: addressProp.isRequired,
      amount: BigNumberProp.isRequired,
      gas: BigNumberProp.isRequired,
      gasPrice: BigNumberProp.isRequired,
    };
  }

  render() {
    const {tokenAddress, amount, gas, gasPrice, to} = this.props;
    const networkFee = new BigNumber(gasPrice).times(gas).toString();

    return (
      <BigCenter>
        <Row style={styles.center}>
          <TokenIcon
            address={tokenAddress}
            amount={amount}
            avatarProps={{size: 50}}
            labelProps={{style: [fonts.large]}}
            amountProps={{style: [fonts.large]}}
          />
          <View style={styles.mh2}>
            <Icon name="arrow-long-right" size={24} color="black" />
            <TokenAmount address={tokenAddress} amount={amount} />
          </View>
          <UserIcon
            address={to}
            avatarProps={{size: 50}}
            labelProps={{style: [fonts.large]}}
          />
        </Row>
        <Row style={[styles.alignLeft, styles.textLeft, styles.mt3]}>
          <MutedText>Network Fee: </MutedText>
          <MutedText>
            <EthereumAmount amount={networkFee} unit={'gwei'} />
          </MutedText>
          <MutedText> GWEI</MutedText>
        </Row>
      </BigCenter>
    );
  }
}
