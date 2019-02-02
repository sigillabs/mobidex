import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as AssetService from '../../../../services/AssetService';
import { initialLoad } from '../../../../thunks';
import { connect as connectNavigation } from '../../../../navigation';
import { navigationProp } from '../../../../types/props';
import {
  loadOrderbook,
  updateForexTicker,
  updateForexTickers,
  updateTokenTicker,
  updateTokenTickers
} from '../../../../thunks';
import EmptyList from '../../../components/EmptyList';
import MutedText from '../../../components/MutedText';
import QuoteForexItem from './QuoteForexItem';
import QuoteTokenItem from './QuoteTokenItem';
import QuoteLoadingItem from './QuoteLoadingItem';

class BaseProductItem extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      quoteAssetData: PropTypes.string.isRequired,
      baseAssetData: PropTypes.string.isRequired,
      showForexPrices: PropTypes.bool.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.onRefresh(false);
  }

  render() {
    const quote = AssetService.findAssetByData(this.props.quoteAssetData);
    const base = AssetService.findAssetByData(this.props.baseAssetData);

    if (this.state.loading) {
      <QuoteLoadingItem quoteToken={quote} baseToken={base} />;
    }

    const Component = this.props.showForexPrices
      ? QuoteForexItem
      : QuoteTokenItem;

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.push('navigation.trade.ProductDetails', {
            base,
            quote
          })
        }
      >
        <Component quoteToken={quote} baseToken={base} />
      </TouchableOpacity>
    );
  }

  async onRefresh(reload = true) {
    const quote = AssetService.findAssetByData(this.props.quoteAssetData);
    const base = AssetService.findAssetByData(this.props.baseAssetData);

    this.setState({ loading: true });
    await Promise.all([
      this.props.dispatch(updateForexTicker(base.symbol, reload)),
      this.props.dispatch(updateTokenTicker(base.symbol, quote.symbol, reload)),
      this.props.dispatch(
        loadOrderbook(base.assetData, quote.assetData, reload)
      )
    ]);
    this.setState({ loading: false });
  }
}

const ProductItem = connect(
  state => ({
    assets: state.relayer.assets,
    products: state.relayer.products,
    showForexPrices: state.settings.showForexPrices
  }),
  dispatch => ({ dispatch })
)(connectNavigation(BaseProductItem));

class BaseProductScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
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

    return (
      <FlatList
        data={products}
        keyExtractor={(item, index) => `token-${index}`}
        renderItem={({ item, index }) => (
          <ProductItem
            quoteAssetData={item.assetDataA.assetData}
            baseAssetData={item.assetDataB.assetData}
            key={`product-${index}`}
          />
        )}
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
    this.props.dispatch(updateForexTickers(reload));
    this.props.dispatch(updateTokenTickers(reload));
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
)(connectNavigation(BaseProductScreen));
