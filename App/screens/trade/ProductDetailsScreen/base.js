import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import * as AssetService from '../../../../services/AssetService';
import { styles } from '../../../../styles';
import {
  loadAllowance,
  loadBalance,
  loadOrderbook,
  updateForexTicker,
  updateTokenTicker
} from '../../../../thunks';
import ForexProductDetailsView from './ForexProductDetailsView';
import TokenProductDetailsView from './TokenProductDetailsView';

const periods = ['Day', 'Month', 'Year'];

class BaseProductDetailsScreen extends Component {
  static propTypes = {
    base: PropTypes.object.isRequired,
    quote: PropTypes.object.isRequired,
    showForexPrices: PropTypes.bool,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      period: 1,
      refreshing: false
    };
  }

  render() {
    const { base, quote } = this.props;

    return (
      <ScrollView
        contentContainerStyle={[styles.flex0, styles.fluff0]}
        contentInsetAdjustmentBehavior={'never'}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      >
        {this.props.showForexPrices ? (
          <ForexProductDetailsView
            base={base}
            quote={quote}
            periodIndex={this.state.period}
            periods={periods}
          />
        ) : (
          <TokenProductDetailsView
            base={base}
            quote={quote}
            periodIndex={this.state.period}
            periods={periods}
          />
        )}
      </ScrollView>
    );
  }

  async onRefresh(reload = true) {
    const { base, quote } = this.props;
    const feeAsset = AssetService.getFeeAsset();

    this.setState({ refreshing: true });
    await Promise.all([
      this.props.dispatch(updateForexTicker(base.symbol, reload)),
      this.props.dispatch(updateForexTicker(quote.symbol, reload)),
      this.props.dispatch(updateTokenTicker(base.symbol, quote.symbol, reload)),
      this.props.dispatch(loadAllowance(base.assetData, reload)),
      this.props.dispatch(loadAllowance(quote.assetData, reload)),
      this.props.dispatch(loadAllowance(feeAsset.assetData, reload)),
      this.props.dispatch(loadBalance(base.assetData, reload)),
      this.props.dispatch(loadBalance(quote.assetData, reload)),
      this.props.dispatch(
        loadOrderbook(base.assetData, quote.assetData, reload)
      )
    ]);
    this.setState({ refreshing: false });
  }
}

export default connect(
  state => ({
    showForexPrices: state.settings.showForexPrices
  }),
  dispatch => ({ dispatch })
)(BaseProductDetailsScreen);
