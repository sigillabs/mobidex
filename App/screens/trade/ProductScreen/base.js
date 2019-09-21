import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {tokenProp} from '../../../../types/props';
import TokenList from './TokenList';

class BaseProductScreen extends Component {
  static get propTypes() {
    return {
      tokens: PropTypes.arrayOf(tokenProp).isRequired,
    };
  }

  render() {
    const {tokens} = this.props;

    return <TokenList tokens={tokens} />;
  }
}

const ProductScreen = connect(state => ({
  tokens: state.tokens,
}))(BaseProductScreen);

export default ProductScreen;
