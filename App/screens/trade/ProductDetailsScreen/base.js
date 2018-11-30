import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import {
  loadOrderbook,
  updateForexTickers,
  updateTokenTickers
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

    this.setState({ refreshing: true });
    await Promise.all([
      this.props.dispatch(updateForexTickers(reload)),
      this.props.dispatch(updateTokenTickers(reload)),
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
