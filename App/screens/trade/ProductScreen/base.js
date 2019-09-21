import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as AssetService from '../../../../services/AssetService';
import {tokenProp} from '../../../../types/props';
import TokenList from './TokenList';

class BaseProductScreen extends Component {
  static get propTypes() {
    return {
      tokens: PropTypes.arrayOf(tokenProp).isRequired,
    };
  }

  render() {
    const tokens = this.props.tokens.slice();
    tokens.unshift(AssetService.getETHAsset());
    return <TokenList tokens={tokens} />;
  }
}

const ProductScreen = connect(state => ({
  tokens: state.tokens,
}))(BaseProductScreen);

export default ProductScreen;
