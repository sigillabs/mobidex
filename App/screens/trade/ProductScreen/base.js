import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as AssetService from '../../../../services/AssetService';
import { initialLoad } from '../../../../thunks';
import { push } from '../../../../navigation';
import EmptyList from '../../../components/EmptyList';
import MutedText from '../../../components/MutedText';
import QuoteForexItem from './QuoteForexItem';
import QuoteTokenItem from './QuoteTokenItem';

class BaseProductScreen extends Component {
  static get propTypes() {
    return {
      assets: PropTypes.array.isRequired,
      products: PropTypes.array.isRequired,
      showForexPrices: PropTypes.bool.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  render() {
    const { products } = this.props;
    const ProductItem = this.props.showForexPrices
      ? QuoteForexItem
      : QuoteTokenItem;

    return (
      <FlatList
        data={products}
        keyExtractor={(item, index) => `token-${index}`}
        renderItem={({ item, index }) => {
          const quote = AssetService.findAssetByData(item.assetDataA.assetData);
          const base = AssetService.findAssetByData(item.assetDataB.assetData);
          return (
            <TouchableOpacity
              onPress={() =>
                push('navigation.trade.ProductDetails', { base, quote })
              }
            >
              <ProductItem quoteToken={quote} baseToken={base} />
            </TouchableOpacity>
          );
        }}
        refreshing={this.state.refreshing}
        onRefresh={() => this.onRefresh()}
        ListEmptyComponent={() => (
          <EmptyList
            wrapperStyle={{
              height: '100%',
              width: '100%',
              justifyContent: 'flex-start'
            }}
          >
            <MutedText style={{ marginTop: 25 }}>Loading Products</MutedText>
          </EmptyList>
        )}
      />
    );
  }

  async onRefresh(reload = true) {
    this.setState({ refreshing: true });
    await this.props.dispatch(initialLoad(reload ? 3 : 0));
    this.setState({ refreshing: false });
  }
}

export default connect(
  state => ({
    assets: state.relayer.assets,
    products: state.relayer.products,
    showForexPrices: state.settings.showForexPrices
  }),
  dispatch => ({ dispatch })
)(BaseProductScreen);
