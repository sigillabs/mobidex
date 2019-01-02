import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { formatMoney } from '../../utils';
import Inf0xClient from '../../clients/inf0x';
import PriceGraph from '../components/PriceGraph';

const INTERVALS = ['MINUTE', 'HOUR', 'DAY'];
const SAMPLES = [24 * 60, 24 * 7, 30];

class ForexPriceGraph extends Component {
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
      selectedTab: 1
    };
  }

  componentDidMount() {
    this.updatePrices();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.baseSymbol !== this.props.baseSymbol ||
      prevProps.quoteSymbol !== this.props.quoteSymbol ||
      prevState.selectedTab !== this.state.selectedTab
    ) {
      this.updatePrices();
    }
  }

  render() {
    const { selectedTab, ...restOfState } = this.state;
    const { height } = Dimensions.get('window');

    return (
      <PriceGraph
        height={height - this.props.heightOffset - 35}
        {...this.props}
        {...restOfState}
        interval={INTERVALS[selectedTab]}
        n={SAMPLES[selectedTab]}
        formatAmount={v => formatMoney(v)}
        selectedTab={selectedTab}
        onChangeTab={this.changeInterval}
      />
    );
  }

  changeInterval = index => this.setState({ selectedTab: index });

  async updatePrices() {
    this.setState({ loading: true });
    const data = await this.getPrices();
    this.setState({ loading: false, data });
  }

  async getPrices() {
    const client = new Inf0xClient(this.props.inf0xEndpoint, {
      network: this.props.network
    });
    return client.getForexPrices(
      this.props.baseSymbol,
      this.props.forexCurrency,
      INTERVALS[this.state.selectedTab],
      SAMPLES[this.state.selectedTab],
      true
    );
  }
}

export default connect(({ settings: { inf0xEndpoint, network } }) => ({
  network,
  inf0xEndpoint
}))(ForexPriceGraph);
