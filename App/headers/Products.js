import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import FakeHeaderButton from '../components/FakeHeaderButton';
import ToggleForexButton from '../views/ToggleForexButton';
import NavigationService from '../../services/NavigationService';
import * as TokenService from '../../services/TokenService';

const DEFAULT_TITLE = 'Trade';

class ProductsHeader extends Component {
  render() {
    return (
      <Header
        backgroundColor={colors.background}
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={
          this.props.showBackButton ? (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => NavigationService.goBack()}
            >
              <Icon name="arrow-back" color="black" size={15} />
            </TouchableOpacity>
          ) : (
            <FakeHeaderButton />
          )
        }
        centerComponent={{
          text: this.renderTitle(),
          style: { color: 'black', fontSize: 18 }
        }}
        rightComponent={
          this.props.showForexToggleButton ? <ToggleForexButton /> : null
        }
        outerContainerStyles={{ height: 60, paddingTop: 0 }}
      />
    );
  }

  renderTitle() {
    if (this.props.title) {
      return this.props.title;
    }

    if (this.props.product) {
      const quoteToken = TokenService.getQuoteToken();
      const tokenA = TokenService.findTokenByAddress(
        this.props.product.tokenA.address
      );
      const tokenB = TokenService.findTokenByAddress(
        this.props.product.tokenB.address
      );

      if (quoteToken && tokenA && tokenB) {
        if (tokenA.address === quoteToken.address) {
          return `Trade ${tokenB.name}`;
        }

        if (tokenB.address === quoteToken.address) {
          return `Trade ${tokenA.name}`;
        }
      }
    }

    return DEFAULT_TITLE;
  }
}

ProductsHeader.propTypes = {
  showBackButton: PropTypes.bool,
  showForexToggleButton: PropTypes.bool,
  title: PropTypes.string,
  product: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default connect(
  state => ({
    tokens: state.relayer.tokens
  }),
  dispatch => ({ dispatch })
)(ProductsHeader);
