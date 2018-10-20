import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PreviewFillAsks from './asks';
import PreviewFillBids from './bids';

export default class PreviewFillOrders extends Component {
  render() {
    const hideHeader = () => {
      this.props.navigation.setParams({ hideHeader: true });
    };
    const showHeader = () => {
      this.props.navigation.setParams({ hideHeader: false });
    };
    if (this.props.navigation.state.params.side === 'buy') {
      return (
        <PreviewFillAsks
          quote={this.props.navigation.state.params.quote}
          hideHeader={hideHeader}
          showHeader={showHeader}
          fee={0}
        />
      );
    } else {
      return (
        <PreviewFillBids
          quote={this.props.navigation.state.params.quote}
          hideHeader={hideHeader}
          showHeader={showHeader}
          fee={0}
        />
      );
    }
  }
}

PreviewFillOrders.propTypes = {
  navigation: PropTypes.object.isRequired
};
