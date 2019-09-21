import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
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
      tokenAddress: addressProp,
      marketDetails: UniswapMarketDetailsProp,
      onPress: PropTypes.func.isRequired,
    };
  }

  render() {
    const {tokenAddress} = this.props;

    if (!tokenAddress) return null;

    const loading =
      !this.props.marketDetails ||
      !this.props.marketDetails.marketRate ||
      !this.props.marketDetails.marketRate.rateInverted ||
      isNaN(this.props.marketDetails.marketRate.rateInverted);

    return (
      <TouchableOpacity onPress={() => this.props.onPress(tokenAddress)}>
        <ListItem
          roundAvatar
          bottomDivider
          title={
            <Row style={[styles.flex1, styles.center, styles.mh2]}>
              <Col style={[styles.flex1, styles.alignLeft]}>
                <TokenIcon
                  address={tokenAddress}
                  style={{flex: 0}}
                  showName={false}
                  showSymbol={true}
                />
              </Col>
              <Col style={[styles.flex3]}>
                {loading ? this.renderLoading() : this.renderPrice()}
              </Col>
            </Row>
          }
          hideChevron={true}
        />
      </TouchableOpacity>
    );
  }

  renderPrice() {
    const rate = this.props.marketDetails.marketRate.rateInverted.times(
      TEN.pow(18),
    );

    return (
      <React.Fragment>
        <Row>
          <EthereumAmount amount={rate} unit={'ether'} />
          <Text> </Text>
          <FormattedSymbol symbol="ETH" />
        </Row>
        <MutedText>Price</MutedText>
      </React.Fragment>
    );
  }

  renderLoading() {
    return <ActivityIndicator />;
  }
}

const TokenItem = withMarketDetails(BaseTokenItem, 'tokenAddress');

export default TokenItem;
