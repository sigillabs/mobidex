import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {ZERO} from '../../../constants';
import {addressProp} from '../../../types/props';
import {loadAllowance} from '../../../thunks';

export default function withTokenAllowance(
  WrapperComponent,
  passName = 'tokenAllowance',
  tokenPropName = 'tokenAddress',
  senderPropName = 'senderAddress',
) {
  class TokenAllowance extends React.Component {
    static get propTypes() {
      return {
        [tokenPropName]: addressProp,
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
          loading={
            this.props.loading || this.state.loading || this.state.refreshing
          }
        />
      );
    }

    async refresh() {
      if (!this.props[tokenPropName] || !this.props[senderPropName]) {
        return;
      }

      this.setState({loading: false, refreshing: true});
      await this.props.dispatch(
        loadAllowance(this.props[tokenPropName], this.props[senderPropName]),
      );
      this.setState({loading: false, refreshing: false});
    }
  }

  function extractProps(state, props) {
    const {
      wallet: {allowances},
    } = state;
    const {tokenAddress} = props;
    return {[passName]: new BigNumber(allowances[tokenAddress])};
  }

  return connect(
    extractProps,
    dispatch => ({dispatch}),
  )(TokenAllowance);
}
