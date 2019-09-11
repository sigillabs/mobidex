import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {ListItem} from 'react-native-elements';
import {TEN} from '../../../../../constants';
import {styles} from '../../../../../styles';
import {
  addressProp,
  BigNumberProp,
  UniswapMarketDetailsProp,
} from '../../../../../types/props';
import Col from '../../../../components/Col';
import Row from '../../../../components/Row';
import MutedText from '../../../../components/MutedText';
import TokenIcon from '../../../../components/TokenIcon';
import EthereumAmount from '../../../../components/EthereumAmount';
import FormattedSymbol from '../../../../components/FormattedSymbol';
import withMarketDetails from '../../../../hoc/uniswap/MarketDetails';

class BaseTokenItem extends Component {
  static get propTypes() {
    return {
      address: addressProp,
      marketDetails: UniswapMarketDetailsProp,
      onPress: PropTypes.func.isRequired,
    };
  }

  render() {
    const {address} = this.props;

    if (!address) return null;
    if (!this.props.marketDetails) return null;
    if (!this.props.marketDetails.marketRate) return null;
    if (!this.props.marketDetails.marketRate.rateInverted) return null;
    if (isNaN(this.props.marketDetails.marketRate.rateInverted)) return null;

    const rate = this.props.marketDetails.marketRate.rateInverted.times(
      TEN.pow(18),
    );

    return (
      <TouchableOpacity onPress={() => this.props.onPress(address)}>
        <ListItem
          roundAvatar
          bottomDivider
          title={
            <Row style={[styles.flex1, styles.center, styles.mh2]}>
              <Col style={[styles.flex1, styles.alignLeft]}>
                <TokenIcon
                  address={address}
                  style={{flex: 0}}
                  showName={false}
                  showSymbol={true}
                />
              </Col>
              <Col style={[styles.flex3]}>
                <Row>
                  <EthereumAmount amount={rate} unit={'ether'} />
                  <Text> </Text>
                  <FormattedSymbol symbol="ETH" />
                </Row>
                <MutedText>Price</MutedText>
              </Col>
            </Row>
          }
          hideChevron={true}
        />
      </TouchableOpacity>
    );
  }
}

const TokenItem = withMarketDetails(BaseTokenItem, 'address');

export default TokenItem;
