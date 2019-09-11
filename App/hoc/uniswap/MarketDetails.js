import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {getMarketDetails, getTokenReserves} from '@uniswap/sdk';

export default function withMarketDetails(
  WrapperComponent,
  propName = 'tokenAddress',
) {
  class BaseMarketDetails extends React.Component {
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
          loading: props.refresh,
        };
      }

      return state;
    }

    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        marketDetails: null,
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
      const {network} = this.props;
      const address = this.props[propName];
      const tokenReserves = await getTokenReserves(address, network);
      const marketDetails = await getMarketDetails(undefined, tokenReserves);

      this.setState({marketDetails, loading: false});
    }
  }

  const MarketDetails = connect(
    state => ({
      network: state.settings.network,
    }),
    dispatch => ({dispatch}),
  )(BaseMarketDetails);

  return MarketDetails;
}
