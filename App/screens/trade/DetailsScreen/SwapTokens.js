import {
  BigNumber,
  tradeExactEthForTokens,
  tradeExactTokensForEth,
  getExecutionDetails,
} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Slider} from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import {
  ETH_TO_TOKEN_SWAP_INPUT_GAS,
  TEN,
  TOKEN_TO_ETH_SWAP_INPUT_GAS,
} from '../../../../constants';
import {bigIntToEthHex} from '../../../../lib/utils';
import {
  connect as connectNavigation,
  showErrorModal,
} from '../../../../navigation';
import * as AssetService from '../../../../services/AssetService';
import {styles, fonts} from '../../../../styles';
import {
  navigationProp,
  MarketDetailsProp,
  BigNumberProp,
} from '../../../../types/props';
import {
  ConfirmActionErrorSuccessFlow,
  loadBalance,
  refreshGasPrice,
} from '../../../../thunks';
import withMarketDetails from '../../../hoc/uniswap/MarketDetails';
import withExchangeContract from '../../../hoc/uniswap/ExchangeContract';
import Button from '../../../components/Button';
import EthereumAmount from '../../../components/EthereumAmount';
import EthereumIcon from '../../../components/EthereumIcon';
import FormattedPercent from '../../../components/FormattedPercent';
import FormattedSymbol from '../../../components/FormattedSymbol';
import MajorText from '../../../components/MajorText';
import Row from '../../../components/Row';
import TokenIcon from '../../../components/TokenIcon';
import TradeConfirmation from './TradeConfirmation';

const style = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    flex: 0,
  },
});

class BaseSwapTokens extends Component {
  static get propTypes() {
    return {
      loading: PropTypes.boolean,
      navigation: navigationProp.isRequired,
      tokenAddress: PropTypes.string.isRequired,
      marketDetails: MarketDetailsProp,
      ethereumBalance: BigNumberProp,
      tokenBalance: BigNumberProp,
      gasPrice: BigNumberProp,
      exchangeContractAddress: PropTypes.string,
      ExchangeContract: PropTypes.object,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };
  }

  get networkFee() {
    if (this.state.value < 0) {
      return this.props.gasPrice.times(TOKEN_TO_ETH_SWAP_INPUT_GAS);
    } else if (this.state.value > 0) {
      return this.props.gasPrice.times(ETH_TO_TOKEN_SWAP_INPUT_GAS);
    } else {
      return 0;
    }
  }

  get price() {
    const {decimals: ethereumDecimals} = AssetService.findAssetByAddress('ETH');
    return this.props.marketDetails.marketRate.rateInverted.times(
      TEN.pow(ethereumDecimals),
    );
  }

  get ratesInBaseUnits() {
    const {decimals: tokenDecimals} = AssetService.findAssetByAddress(
      this.props.tokenAddress,
    );
    const {decimals: ethereumDecimals} = AssetService.findAssetByAddress('ETH');
    const rate = this.props.marketDetails.marketRate.rate.times(
      TEN.pow(tokenDecimals - ethereumDecimals),
    );
    const rateInverted = this.props.marketDetails.marketRate.rateInverted.times(
      TEN.pow(ethereumDecimals - tokenDecimals),
    );
    return {
      rate,
      rateInverted,
    };
  }

  get ethereumBalanceChange() {
    const {ethereumBalance, tokenBalance} = this.props;
    const {
      rate: rateBaseUnits,
      rateInverted: rateInvertedBaseUnits,
    } = this.ratesInBaseUnits;
    const maxEthereumTransfer = rateInvertedBaseUnits.times(tokenBalance);

    if (this.state.value < 0) {
      return maxEthereumTransfer.times(-this.state.value).integerValue();
    } else if (this.state.value > 0) {
      if (ethereumBalance.isGreaterThan(this.networkFee)) {
        return ethereumBalance
          .minus(this.networkFee)
          .times(-this.state.value)
          .integerValue();
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  get tokenBalanceChange() {
    const {ethereumBalance, tokenBalance} = this.props;
    const {
      rate: rateBaseUnits,
      rateInverted: rateInvertedBaseUnits,
    } = this.ratesInBaseUnits;
    const maxTokenTransfer = rateBaseUnits.times(
      ethereumBalance.minus(this.networkFee),
    );

    if (this.state.value < 0) {
      return tokenBalance.times(this.state.value).integerValue();
    } else if (this.state.value > 0) {
      return maxTokenTransfer.times(this.state.value).integerValue();
    } else {
      return 0;
    }
  }

  componentDidMount() {
    this.props.dispatch(loadBalance(null));
    this.props.dispatch(loadBalance(this.props.tokenAddress));
    this.props.dispatch(refreshGasPrice());
  }

  render() {
    const {
      exchangeContractAddress,
      tokenAddress,
      ethereumBalance,
      tokenBalance,
      loading,
      gasPrice,
    } = this.props;

    if (loading || !ethereumBalance || !gasPrice) {
      return null;
    }

    const updatedTokenBalance = tokenBalance
      .plus(this.tokenBalanceChange)
      .integerValue();
    const updatedEthereumBalance = ethereumBalance
      .plus(this.ethereumBalanceChange)
      .integerValue();

    return (
      <React.Fragment>
        <View style={[styles.flex1]}>
          <View style={style.container}>
            <TokenIcon
              address={tokenAddress}
              amount={updatedTokenBalance}
              avatarProps={{size: 100}}
              labelProps={{style: [fonts.large]}}
              amountProps={{style: [fonts.large]}}
            />
          </View>
          <Row style={[styles.center, styles.w100, styles.mv3]}>
            <View style={styles.textCenter}>
              <TokenIcon
                address={null}
                avatarProps={{size: 50}}
                showAmount={false}
                showName={false}
                showSymbol={false}
              />
              <FormattedPercent
                percent={-this.state.value}
                style={styles.textCenter}
              />
            </View>
            <View style={(styles.textCenter, styles.mh3)}>
              <Slider
                style={[styles.w100]}
                value={this.state.value}
                minimumValue={-1}
                maximumValue={1}
                step={0.01}
                onValueChange={value => this.setState({value})}
              />
              <Row
                style={StyleSheet.flatten([
                  styles.center,
                  styles.textCenter,
                  styles.w100,
                ])}>
                <Entypo
                  name="swap"
                  size={15}
                  color="black"
                  style={styles.mr1}
                />
                <EthereumAmount amount={this.price} unit={'ether'} />
                <Text> </Text>
                <FormattedSymbol address={null} />
              </Row>
            </View>
            <View style={styles.textCenter}>
              <TokenIcon
                address={tokenAddress}
                avatarProps={{size: 50}}
                showAmount={false}
                showName={false}
                showSymbol={false}
              />
              <FormattedPercent
                percent={this.state.value}
                style={styles.textCenter}
              />
            </View>
          </Row>
          <View style={style.container}>
            <EthereumIcon
              address={tokenAddress}
              amount={updatedEthereumBalance}
              avatarProps={{size: 100}}
              labelProps={{style: [fonts.large]}}
              amountProps={{style: [fonts.large]}}
            />
          </View>
        </View>

        <View style={[styles.flex0]}>
          <Button title={'Swap'} onPress={this.onSwap} />
        </View>
      </React.Fragment>
    );
  }

  onSwap = async () => {
    const {ethereumBalance, ExchangeContract} = this.props;

    if (ethereumBalance.isLessThan(this.networkFee)) {
      return showErrorModal(
        new Error('You do not have enough Ethereum to cover the network fee'),
      );
    }

    let tradeDetails = null;
    if (this.state.value < 0) {
      tradeDetails = await tradeExactTokensForEth(
        this.props.tokenAddress,
        this.tokenBalanceChange.absoluteValue(),
      );
    } else if (this.state.value > 0) {
      tradeDetails = await tradeExactEthForTokens(
        this.props.tokenAddress,
        this.ethereumBalanceChange.absoluteValue(),
      );
    } else {
      return;
    }

    const executionDetails = await getExecutionDetails(tradeDetails);
    const methodArguments = executionDetails.methodArguments.map(
      bigIntToEthHex,
    );
    const txValue = bigIntToEthHex(executionDetails.value);
    const action = async () =>
      new Promise((resolve, reject) => {
        ExchangeContract.methods[executionDetails.methodName]
          .apply(ExchangeContract, methodArguments)
          .send({value: txValue})
          .on('transactionHash', hash => {
            resolve(hash);
          })
          .on('receipt', receipt => {
            console.log('receipt', receipt);
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            console.debug('confirmation', confirmationNumber, receipt);
          })
          .on('error', reject);
      });
    const actionOptions = {
      action,
      icon: <Entypo name="arrow-with-circle-up" size={100} />,
      label: <MajorText>Swapping...</MajorText>,
    };
    const confirmationOptions = {
      label: (
        <TradeConfirmation
          tradeDetails={tradeDetails}
          executionDetails={executionDetails}
        />
      ),
    };
    this.props.dispatch(
      ConfirmActionErrorSuccessFlow(
        this.props.navigation.componentId,
        confirmationOptions,
        actionOptions,
        <Text>
          Swap transaction successfully sent to the Ethereum network. It takes a
          few minutes for Ethereum to confirm the transaction.
        </Text>,
      ),
    );
  };
}

let SwapTokens = connectNavigation(BaseSwapTokens);
SwapTokens = connect(
  ({wallet: {balances, allowances}, settings: {gasPrice}}, {tokenAddress}) => ({
    ethereumBalance: new BigNumber(balances[null]),
    tokenBalance: new BigNumber(balances[tokenAddress]),
    gasPrice,
  }),
  dispatch => ({dispatch}),
)(SwapTokens);
SwapTokens = withMarketDetails(SwapTokens);
SwapTokens = withExchangeContract(SwapTokens);

export default SwapTokens;
