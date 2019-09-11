import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text, RefreshControl, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import {fonts, styles} from '../../../../styles';
import {refreshGasPrice} from '../../../../thunks';
import {
  BigNumberProp,
  UniswapTradeDetailsProp,
  UniswapExecutionDetailsProp,
} from '../../../../types/props';
import MutedText from '../../../components/MutedText';
import Row from '../../../components/Row';
import EthereumAmount from '../../../components/EthereumAmount';
import TokenIcon from '../../../components/TokenIcon';

const GAS = {
  ethToTokenSwapInput: 12757,
  tokenToEthSwapInput: 47503,
};

class TradeConfirmation extends Component {
  static get propTypes() {
    return {
      tradeDetails: UniswapTradeDetailsProp.isRequired,
      executionDetails: UniswapExecutionDetailsProp.isRequired,
      gasPrice: BigNumberProp.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {refreshing: true};
  }

  componentDidMount() {
    this.onRefresh();
  }

  render() {
    const {tradeDetails, executionDetails, gasPrice} = this.props;
    const gas = GAS[executionDetails.methodName];
    const networkFee = gasPrice.times(gas).toString();

    return (
      <ScrollView
        contentContainerStyle={[styles.h100, styles.w100, styles.bigCenter]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        <Row style={styles.center}>
          <TokenIcon
            address={tradeDetails.inputAmount.token.address}
            amount={tradeDetails.inputAmount.amount}
            avatarProps={{size: 50}}
            labelProps={{style: [fonts.large]}}
            amountProps={{style: [fonts.large]}}
          />
          <Icon name="swap" size={24} color="black" style={styles.mh2} />
          <TokenIcon
            address={tradeDetails.outputAmount.token.address}
            amount={tradeDetails.outputAmount.amount}
            avatarProps={{size: 50}}
            labelProps={{style: [fonts.large]}}
            amountProps={{style: [fonts.large]}}
          />
        </Row>
        <Row style={[styles.alignLeft, styles.textLeft, styles.mt3]}>
          <MutedText>Network Fee: </MutedText>
          <MutedText>
            <EthereumAmount amount={networkFee} unit={'gwei'} />
          </MutedText>
          <MutedText> GWEI</MutedText>
        </Row>
      </ScrollView>
    );
  }

  onRefresh = async () => {
    this.setState({refreshing: true});
    await this.props.dispatch(refreshGasPrice());
    this.setState({refreshing: false});
  };
}

export default connect(
  ({settings: {gasPrice}}) => ({gasPrice}),
  dispatch => ({dispatch}),
)(TradeConfirmation);
