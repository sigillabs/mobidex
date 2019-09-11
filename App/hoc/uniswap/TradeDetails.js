import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {getTradeDetails, getTokenReserves} from '@uniswap/sdk';

export default function withTradeDetails(
  WrapperComponent,
  propName = 'tokenAddress',
) {
  class BaseTradeDetails extends React.Component {
    static get propTypes() {
      return {
        [propName]: PropTypes.string.isRequired,
        network: PropTypes.number.isRequired,
        refresh: PropTypes.bool,
      };
    }

    static getDerivedStateFromProps(props, state) {
      if (props.refresh) {
        return {
          ...state,
          refresh: props.refresh,
        };
      }

      return state;
    }

    constructor(props) {
      super(props);

      this.state = {
        refresh: true,
        loading: true,
        tradeDetails: null,
        error: false,
        success: false,
      };
    }

    componentDidMount() {
      this.refresh();
    }

    componentDidUpdate() {
      if (this.state.refresh) {
        this.refresh();
      }
    }

    render() {
      return <WrapperComponent {...this.props} {...this.state} />;
    }

    async refresh() {
      const {network} = this.props;
      const address = this.props[propName];
      const baseTokenReserves = await getTokenReserves(address, network);
      const tradeDetails = await getTradeDetails(undefined, baseTokenReserves);

      this.setState({tradeDetails, refresh: false});
    }
  }

  const TradeDetails = connect(
    state => ({
      network: state.settings.network,
    }),
    dispatch => ({dispatch}),
  )(BaseTradeDetails);

  return TradeDetails;
}
