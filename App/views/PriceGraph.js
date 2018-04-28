import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

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

export default class PriceGraph extends React.PureComponent {
  static propTypes = {
    height: PropTypes.number.isRequired,
    interval: PropTypes.string.isRequired,
    data: PropTypes.arrayOf({
      timestamp: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired
    }).isRequired
  };

  static defaultProps = {
    height: 0,
    interval: 'DAY',
    data: []
  };

  render() {
    let {
      containerStyle,
      chartStyle,
      YAxisStyle,
      XAxisStyle,
      ...rest
    } = this.props;
    let { interval, data } = rest;

    interval = interval.toUpperCase();

    return (
      <View
        style={[
          { flex: 1, height: this.props.height, padding: 10 },
          containerStyle
        ]}
      >
        {/*<YAxis
          style={[{ marginVertical: 0 }, YAxisStyle]}
          data={data}
          formatLabel={({ price }) => item.price}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />*/}
        <LineChart
          style={[{ flex: 1, marginHorizontal: -10 }, chartStyle]}
          data={data}
          svg={{ stroke: 'rgb(134, 65, 244)' }}
          contentInset={{ top: 20, bottom: 20 }}
          xAccessor={({ index, item }) => index}
          yAccessor={({ index, item }) => parseFloat(item.price)}
          showGrid={false}
        />
        {/*<XAxis
          style={[{ marginHorizontal: -10 }, XAxisStyle]}
          data={data}
          // xAccessor={({ item }) => item.timestamp}
          // formatLabel={X_LABELS[interval]}
          formatLabel={(value, index) =>
            X_LABELS[interval](data[index].timestamp)
          }
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fontSize: 10 }}
        />*/}
      </View>
    );
  }
}
