import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import * as AssetService from '../../../services/AssetService';
import {UniswapService} from '../../../services/UniswapService';
import {addressProp} from '../../../types/props';

export default function withFactoryContract(
  WrapperComponent,
  passAddressName = 'exchangeContractAddress',
  passContractName = 'ExchangeContract',
) {
  class BaseExchangeContract extends React.Component {
    static get propTypes() {
      return {
        tokenAddress: addressProp,
        factoryAddress: PropTypes.string.isRequired,
      };
    }

    constructor(props) {
      super(props);

      this.state = {
        [passAddressName]: null,
        [passContractName]: null,
        loading: true,
      };
    }

    async componentDidMount() {
      const {tokenAddress} = this.props;

      if (!AssetService.isEthereum(tokenAddress)) {
        const exchangeAddress = await UniswapService.instance.getExchangeAddressForToken(
          tokenAddress,
        );
        const exchangeContract = await UniswapService.instance.getExchangeContract(
          exchangeAddress,
        );

        this.setState({
          [passAddressName]: exchangeAddress,
          [passContractName]: exchangeContract,
          loading: false,
        });
      }

      this.setState({
        loading: false,
      });
    }

    render() {
      return (
        <WrapperComponent
          {...this.state}
          {...this.props}
          loading={this.props.loading || this.state.loading}
        />
      );
    }
  }

  const ExchangeContract = connect(
    state => ({
      factoryAddress: state.settings.uniswap.factoryAddress,
    }),
    dispatch => ({dispatch}),
  )(BaseExchangeContract);

  return ExchangeContract;
}
