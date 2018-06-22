import * as _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Animated, PanResponder, View } from 'react-native';
import { Text } from 'react-native-elements';
import { G, Line, Text as SVGText } from 'react-native-svg';
import { LineChart } from 'react-native-svg-charts';
import { colors } from '../../styles';
import { formatMoney } from '../../utils';

const X_LABELS = {
  MINUTE: timestamp => moment(timestamp).format('mm'),
  HOUR: timestamp => moment(timestamp).format('h'),
  DAY: timestamp => moment(timestamp).format('Do'),
  MONTH: timestamp => moment(timestamp).format('Do'),
  YEAR: timestamp => moment(timestamp).format('Y')
};

const X_ACCESSORS = {
  MINUTE: ({ index, item }) => index,
  HOUR: ({ index, item }) => index,
  DAY: ({ index, item }) => index,
  MONTH: ({ index, item }) => index,
  YEAR: ({ index, item }) => index
};

class SVGHorizontalLine extends React.PureComponent {
  render() {
    return (
      <G y={this.props.y}>
        <SVGText x={0} y={4}>
          {formatMoney(this.props.value)}
        </SVGText>
        <Line
          key={'min-axis'}
          x1={40}
          x2={'100%'}
          y1={0}
          y2={0}
          stroke={'black'}
          strokeDasharray={[4, 8]}
          strokeWidth={2}
        />
      </G>
    );
  }
}

export default class PriceGraph extends React.PureComponent {
  static propTypes = {
    height: PropTypes.number.isRequired,
    interval: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
      })
    ).isRequired
  };

  static defaultProps = {
    height: 0,
    interval: 'DAY',
    data: []
  };

  render() {
    const { containerStyle, chartStyle, ...rest } = this.props;
    const { data } = rest;
    const min = parseFloat(
      _.minBy(data, ({ price }) => parseFloat(price)).price
    );
    const max = parseFloat(
      _.maxBy(data, ({ price }) => parseFloat(price)).price
    );
    const middle = max - (max - min) / 2;
    const MinimumHorizontalLine = ({ y }) => (
      <SVGHorizontalLine y={y(min)} value={min} />
    );
    const MaximumHorizontalLine = ({ y }) => (
      <SVGHorizontalLine y={y(max)} value={max} />
    );
    const MiddleHorizontalLine = ({ y }) => (
      <SVGHorizontalLine y={y(middle)} value={middle} />
    );

    return (
      <View
        style={[
          {
            flex: 1,
            height: this.props.height,
            padding: 0,
            marginHorizontal: 10
          },
          containerStyle
        ]}
      >
        <LineChart
          style={[{ flex: 1, marginHorizontal: 0 }, chartStyle]}
          data={data}
          svg={{ stroke: colors.yellow0, strokeWidth: 2 }}
          contentInset={{ top: 10, right: 0, bottom: 10, left: 40 }}
          xAccessor={({ index, item }) => index}
          yAccessor={({ index, item }) => parseFloat(item.price)}
          gridMin={min}
          gridMax={max}
          numberOfTicks={10}
        >
          <MinimumHorizontalLine />
          <MaximumHorizontalLine />
          <MiddleHorizontalLine />
        </LineChart>
        <Text style={{ textAlign: 'center' }}>{this.props.label}</Text>
      </View>
    );
  }
}
