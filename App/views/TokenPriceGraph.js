import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { formatAmount } from '../../utils';
import Inf0xClient from '../../clients/inf0x';
import PriceGraph from '../components/PriceGraph';
import Tabs from '../components/Tabs';

const TABS = ['Day', 'Week', 'Month'];
const INTERVALS = ['HOUR', 'HOUR', 'DAY'];
const SAMPLES = [24, 24 * 7, 30];

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
      graphWindow: 1
    };
  }

  componentDidMount() {
    this.updatePrices();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.baseSymbol !== this.props.baseSymbol ||
      prevProps.quoteSymbol !== this.props.quoteSymbol ||
      prevState.graphWindow !== this.state.graphWindow
    ) {
      this.updatePrices();
    }
  }

  render() {
    const { graphWindow, ...restOfState } = this.state;
    const { height } = Dimensions.get('window');

    return (
      <View>
        <PriceGraph
          height={height - 230}
          {...this.props}
          {...restOfState}
          interval={INTERVALS[graphWindow]}
          n={SAMPLES[graphWindow]}
          formatAmount={v => `${formatAmount(v)} ${this.props.quoteSymbol}`}
        />
        <Tabs
          onPress={this.changeInterval}
          selectedIndex={graphWindow}
          buttons={TABS}
          containerStyle={{
            height: 35,
            borderTopWidth: 0.5,
            borderTopColor: colors.grey3
          }}
        />
      </View>
    );
  }

  changeInterval = index => this.setState({ graphWindow: index });

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
      INTERVALS[this.state.graphWindow],
      SAMPLES[this.state.graphWindow],
      true
    );
  }
}

export default connect(({ settings: { inf0xEndpoint, network } }) => ({
  network,
  inf0xEndpoint
}))(TokenPriceGraph);
