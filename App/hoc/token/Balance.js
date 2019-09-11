import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React from 'react';
import EthereumClient from '../../../clients/ethereum';
import TokenClient from '../../../clients/token';
import {ZERO} from '../../../constants';
import {formatHexString} from '../../../lib/utils';
import {WalletService} from '../../../services/WalletService';

export default function withTokenBalance(
  WrapperComponent,
  passName = 'balance',
  propName = 'tokenAddress',
) {
  return class TokenBalance extends React.Component {
    static get propTypes() {
      return {
        [propName]: PropTypes.string.isRequired,
        loading: PropTypes.bool,
      };
    }

    static getDerivedStateFromProps(props, state) {
      if (props.refresh) {
        return {
          ...state,
          loading: props.refresh,
        };
      }

      return state;
    }

    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        [passName]: ZERO,
        error: false,
      };
    }

    componentDidMount() {
      this.refresh();
    }

    componentDidUpdate() {
      if (this.state.loading) {
        this.refresh();
      }
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

    async refresh() {
      const address = this.props[propName];
      const ethereumClient = new EthereumClient(WalletService.instance.web3);
      const tokenAddress = formatHexString(address);
      const tokenClient = new TokenClient(ethereumClient, tokenAddress);
      const balance = await tokenClient.getBalance();
      this.setState({[passName]: new BigNumber(balance), loading: false});
    }
  };
}
