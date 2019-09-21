import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {ListItem} from 'react-native-elements';
import {connect} from 'react-redux';
import {TEN} from '../../../../../constants';
import * as AssetService from '../../../../../services/AssetService';
import {styles} from '../../../../../styles';
import {
  addressProp,
  BigNumberProp,
  UniswapMarketDetailsProp,
} from '../../../../../types/props';
import Col from '../../../../components/Col';
import Row from '../../../../components/Row';
import MutedText from '../../../../components/MutedText';
import AssetIcon from '../../../../components/AssetIcon';
import EthereumAmount from '../../../../components/EthereumAmount';
import FormattedSymbol from '../../../../components/FormattedSymbol';
import withMarketDetails from '../../../../hoc/uniswap/MarketDetails';
import withTokenBalance from '../../../../hoc/token/Balance';

class BaseTokenItem extends Component {
  static get propTypes() {
    return {
      loading: PropTypes.bool,
      tokenAddress: addressProp,
      tokenBalance: BigNumberProp,
      marketDetails: UniswapMarketDetailsProp,
      onPress: PropTypes.func.isRequired,
    };
  }

  render() {
    const {tokenAddress} = this.props;

    if (AssetService.isEthereum(tokenAddress)) {
      return this.renderEthereum();
    } else {
      return this.renderToken();
    }
  }

  renderEthereum() {
    const {tokenAddress, tokenBalance} = this.props;

    return (
      <TouchableOpacity onPress={() => this.props.onPress(tokenAddress)}>
        <ListItem
          roundAvatar
          bottomDivider
          title={
            <AssetIcon
              address={tokenAddress}
              amount={tokenBalance}
              showName={false}
              showSymbol={true}
              showAmount={true}
              style={{flex: 0}}
            />
          }
          hideChevron={true}
        />
      </TouchableOpacity>
    );
  }

  renderToken() {
    const {tokenAddress, tokenBalance} = this.props;

    return (
      <TouchableOpacity onPress={() => this.props.onPress(tokenAddress)}>
        <ListItem
          roundAvatar
          bottomDivider
          title={
            <Row style={[styles.flex1, styles.center, styles.mh2]}>
              <Col style={[styles.flex1, styles.alignLeft]}>
                <AssetIcon
                  address={tokenAddress}
                  amount={tokenBalance}
                  showName={false}
                  showSymbol={true}
                  showAmount={true}
                  style={{flex: 0}}
                />
              </Col>
              <Col style={[styles.flex3]}>{this.renderPrice()}</Col>
            </Row>
          }
          hideChevron={true}
        />
      </TouchableOpacity>
    );
  }

  renderPrice() {
    const {loading, marketDetails} = this.props;

    if (loading) {
      return this.renderLoading();
    }

    if (!marketDetails) {
      return this.renderLoading();
    }

    if (!marketDetails.marketRate) {
      return this.renderLoading();
    }

    if (!marketDetails.marketRate.rateInverted) {
      return this.renderLoading();
    }

    if (isNaN(marketDetails.marketRate.rateInverted)) {
      return this.renderLoading();
    }

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

function extractProps(state, props) {
  const {
    wallet: {balances},
  } = state;
  const {tokenAddress} = props;
  const tokenBalance = balances[tokenAddress];

  return {
    tokenBalance,
  };
}

let TokenItem = connect(
  extractProps,
  dispatch => ({dispatch}),
)(BaseTokenItem);
TokenItem = withTokenBalance(TokenItem);
TokenItem = withMarketDetails(TokenItem, 'tokenAddress');

export default TokenItem;
