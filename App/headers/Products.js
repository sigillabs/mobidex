import * as _ from 'lodash';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { colors } from '../../styles';

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
              onPress={() => this.props.navigation.goBack(null)}
            >
              <Icon name="arrow-back" color="black" size={15} />
            </TouchableOpacity>
          ) : null
        }
        centerComponent={{
          text: this.renderTitle(),
          style: { color: 'black', fontSize: 18 }
        }}
        rightComponent={
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() =>
              this.props.navigation.setParams({
                showForexPrices: !this.props.navigation.getParam(
                  'showForexPrices'
                )
              })
            }
          >
            <Icon name="attach-money" color="black" size={15} />
          </TouchableOpacity>
        }
        outerContainerStyles={{ height: 80 }}
      />
    );
  }

  renderTitle() {
    if (this.props.title) {
      return this.props.title;
    }

    if (this.props.product) {
      const quoteToken = _.find(this.props.tokens, {
        symbol: this.props.settings.quoteSymbol
      });
      const tokenA = _.find(this.props.tokens, {
        address: this.props.product.tokenA.address
      });
      const tokenB = _.find(this.props.tokens, {
        address: this.props.product.tokenB.address
      });

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

export default connect(
  state => ({
    tokens: state.relayer.tokens,
    settings: state.settings
  }),
  dispatch => ({ dispatch })
)(ProductsHeader);
