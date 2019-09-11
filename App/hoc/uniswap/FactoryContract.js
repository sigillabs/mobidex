import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {getMarketDetails, getTokenReserves} from '@uniswap/sdk';
import EthereumClient from '../../../clients/ethereum';
import UniswapClient from '../../../clients/Uniswap';
import {WalletService} from '../../../services/WalletService';

export default function withFactoryContract(
  WrapperComponent,
  passName = 'FactoryContract',
) {
  class BaseFactoryContract extends React.Component {
    static get propTypes() {
      return {
        factoryAddress: PropTypes.string.isRequired,
      };
    }

    constructor(props) {
      super(props);

      this.state = {
        [passName]: null,
      };
    }

    async componentDidMount() {
      const ethereumClient = new EthereumClient(WalletService.instance.web3);
      const uniswapClient = new UniswapClient(
        ethereumClient,
        this.props.address,
      );

      const contract = await uniswap.getFactoryContract();

      this.setState({[passName]: contract});
    }

    render() {
      const otherProps = Object.assign({}, this.props);
      delete otherProps['factoryAddress'];

      return <WrapperComponent {...this.state} {...otherProps} />;
    }
  }

  const FactoryContract = connect(
    state => ({
      factoryAddress: state.settings.uniswap.factoryAddress,
    }),
    dispatch => ({dispatch}),
  )(BaseFactoryContract);

  return FactoryContract;
}
