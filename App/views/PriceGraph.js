import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { G, Line, Text as SVGText } from 'react-native-svg';
import { AreaChart } from 'react-native-svg-charts';
import { colors } from '../../styles';
import { colorWithAlpha } from '../../utils';
import MutedText from '../components/MutedText';

class SVGHorizontalLine extends React.PureComponent {
  render() {
    return (
      <G y={this.props.y}>
        <SVGText x={0} y={4}>
          {this.props.value}
        </SVGText>
        <Line
          key={'min-axis'}
          x1={40}
          x2={'100%'}
          y1={0}
          y2={0}
          stroke={'black'}
          strokeDasharray={[1, 4]}
          strokeWidth={1}
        />
      </G>
    );
  }
}

export default class PriceGraph extends React.PureComponent {
  render() {
    const { containerStyle, chartStyle, ...rest } = this.props;
    const { data } = rest;

    if (!data || !data.length) {
      return this.renderEmptyView();
    }

    const min = parseFloat(
      (_.minBy(data, ({ price }) => parseFloat(price)) || { price: 0 }).price
    );
    const max = parseFloat(
      (_.maxBy(data, ({ price }) => parseFloat(price)) || { price: 0 }).price
    );
    const middle = max - (max - min) / 2;
    const MinimumHorizontalLine = ({ y }) => (
      <SVGHorizontalLine y={y(min)} value={this.props.formatAmount(min)} />
    );
    const MaximumHorizontalLine = ({ y }) => (
      <SVGHorizontalLine y={y(max)} value={this.props.formatAmount(max)} />
    );
    const MiddleHorizontalLine = ({ y }) => (
      <SVGHorizontalLine
        y={y(middle)}
        value={this.props.formatAmount(middle)}
      />
    );

    return (
      <View
        style={[
          {
            flex: 1,
            height: this.props.height,
            padding: 0,
            marginHorizontal: 0
          },
          containerStyle
        ]}
      >
        <Text style={{ textAlign: 'center' }}>{this.props.label}</Text>
        <AreaChart
          style={[{ flex: 1, marginHorizontal: 0 }, chartStyle]}
          data={data}
          svg={{
            stroke: colors.yellow0,
            strokeWidth: 2,
            fill: colorWithAlpha(colors.yellow0, 0.6)
          }}
          contentInset={{ top: 10, right: 0, bottom: 10, left: 0 }}
          xAccessor={({ index, item }) => index}
          yAccessor={({ index, item }) => parseFloat(item.price)}
          gridMin={min}
          gridMax={max}
          numberOfTicks={10}
        >
          <MinimumHorizontalLine />
          <MaximumHorizontalLine />
          <MiddleHorizontalLine />
        </AreaChart>
      </View>
    );
  }

  renderEmptyView() {
    const { containerStyle } = this.props;
    return (
      <View
        style={[
          {
            flex: 1,
            height: this.props.height,
            padding: 0,
            marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center'
          },
          containerStyle
        ]}
      >
        <MutedText style={{ textAlign: 'center' }}>No price history.</MutedText>
      </View>
    );
  }
}

PriceGraph.propTypes = {
  height: PropTypes.number.isRequired,
  interval: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    })
  ).isRequired,
  formatAmount: PropTypes.func.isRequired,
  label: PropTypes.string,
  containerStyle: PropTypes.object,
  chartStyle: PropTypes.object
};

PriceGraph.defaultProps = {
  height: 0,
  interval: 'DAY',
  data: []
};
