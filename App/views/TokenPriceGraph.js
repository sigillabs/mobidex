import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatAmount } from '../../utils';
import Inf0xClient from '../../clients/inf0x';
import PriceGraph from '../components/PriceGraph';

class TokenPriceGraph extends Component {
  static propTypes = {
    network: PropTypes.number.isRequired,
    inf0xEndpoint: PropTypes.string.isRequired,
    baseSymbol: PropTypes.string.isRequired,
    quoteSymbol: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      interval: 'DAY',
      n: 30
    };
  }

  componentDidMount() {
    this.updatePrices();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.baseSymbol !== this.props.baseSymbol &&
      prevProps.quoteSymbol !== this.props.quoteSymbol
    ) {
      this.updatePrices();
    }
  }

  render() {
    return (
      <PriceGraph
        {...this.props}
        {...this.state}
        formatAmount={v => `${formatAmount(v)} ${this.props.quoteSymbol}`}
      />
    );
  }

  async updatePrices() {
    this.setState({ loading: true });
    const data = await this.getPrices();
    this.setState({ loading: false, data });
  }

  async getPrices() {
    const client = new Inf0xClient(this.props.inf0xEndpoint, {
      network: this.props.network
    });
    return client.getTokenPrices(
      this.props.baseSymbol,
      this.props.quoteSymbol,
      this.props.interval,
      this.props.ticks
    );
  }
}

export default connect(({ settings: { inf0xEndpoint, network } }) => ({
  network,
  inf0xEndpoint
}))(TokenPriceGraph);
