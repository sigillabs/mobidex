import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React from 'react';
import EthereumClient from '../../../clients/ethereum';
import {ZERO} from '../../../constants';
import {WalletService} from '../../../services/WalletService';

export default function withEthereumBalance(
  WrapperComponent,
  passName = 'balance',
) {
  return class EthereumBalance extends React.Component {
    static get propTypes() {
      return {
        loading: PropTypes.bool,
      };
    }

    static getDerivedStateFromProps(props, state) {
      if (props.refresh) {
        return {
          ...state,
          [passName]: props.refresh,
        };
      }

      return state;
    }

    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        balance: ZERO,
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
      const ethereumClient = new EthereumClient(WalletService.instance.web3);
      const balance = await ethereumClient.getBalance();
      this.setState({[passName]: new BigNumber(balance), loading: false});
    }
  };
}
