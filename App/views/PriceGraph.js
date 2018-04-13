import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { View } from "react-native";
import { LineChart, XAxis, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";

const X_LABELS = {
  "5MIN": (timestamp) => moment.unix(timestamp).format("mm"),
  "15MIN": (timestamp) => moment.unix(timestamp).format("mm"),
  "30MIN": (timestamp) => moment.unix(timestamp).format("mm"),
  "1HOUR": (timestamp) => moment.unix(timestamp).format("mm"),
  "6HOUR": (timestamp) => moment.unix(timestamp).format("h"),
  "1DAY": (timestamp) => moment.unix(timestamp).format("h"),
  "7DAY": (timestamp) => moment.unix(timestamp).format("Do"),
  "30DAY": (timestamp) => moment.unix(timestamp).format("Do")
};

const X_ACCESSORS = {
  "5MIN": ({ index, item }) => index,
  "15MIN": ({ index, item }) => index,
  "30MIN": ({ index, item }) => index,
  "1HOUR": ({ index, item }) => index,
  "6HOUR": ({ index, item }) => index,
  "1DAY": ({ index, item }) => index,
  "7DAY": ({ index, item }) => index,
  "30DAY": ({ index, item }) => index
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
    interval: "1DAY",
    data: [{timestamp: 1523410025-3600*2, price: 500}, {timestamp: 1523410025-3600, price: 100}, {timestamp: 1523410025, price: 200}]
  };

  render() {
    let { containerStyle, chartStyle, YAxisStyle, XAxisStyle, ...rest } = this.props;
    let { interval, data } = rest;

    interval = interval.toUpperCase();

    return (
      <View style={containerStyle}>
        <YAxis
          style={[{ marginVertical: -10 }, YAxisStyle]}
          data={data}
          formatLabel={({ price }) => item.price}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />
        <LineChart
          style={[chartStyle, { height: this.props.height }]}
          data={data}
          svg={{ stroke: "rgb(134, 65, 244)" }}
          contentInset={{ top: 20, bottom: 20 }}
          xAccessor={X_ACCESSORS[interval]}
          yAccessor={({ index, item }) => item.price}
          showGrid={false}
        />
        <XAxis
          style={[{ marginHorizontal: -10 }, XAxisStyle]}
          data={data}
          xAccessor={({ item }) => item.timestamp}
          formatLabel={X_LABELS[interval]}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />
      </View>
    );
  }
}
