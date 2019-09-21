import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {ZERO} from '../../../constants';
import {addressProp} from '../../../types/props';
import {loadBalance} from '../../../thunks';

export default function withTokenBalance(
  WrapperComponent,
  passName = 'tokenBalance',
  propName = 'tokenAddress',
) {
  class TokenBalance extends React.Component {
    static get propTypes() {
      return {
        [propName]: addressProp,
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
        loading: false,
        refreshing: true,
      };
    }

    componentDidMount() {
      if (this.state.loading) {
        this.refresh();
      }
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
      this.setState({loading: false, refreshing: true});
      await this.props.dispatch(loadBalance(this.props[propName]));
      this.setState({loading: false, refreshing: false});
    }
  }

  function extractProps(state, props) {
    const {
      wallet: {balances},
    } = state;
    const {tokenAddress} = props;
    return {[passName]: new BigNumber(balances[tokenAddress])};
  }

  return connect(
    extractProps,
    dispatch => ({dispatch}),
  )(TokenBalance);
}
