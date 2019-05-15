import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, Dimensions, Platform, View } from 'react-native';
import { G, Line, Text as SVGText } from 'react-native-svg';
import { AreaChart } from 'react-native-svg-charts';
import { colors, styles } from '../../styles';
import { styleProp } from '../../types/props/styles';
import { colorWithAlpha } from '../../lib/utils';
import MutedText from './MutedText';
import Tabs from './Tabs';

const TABS = ['Day', 'Week', 'Month'];

class SVGHorizontalLine extends React.PureComponent {
  static get propTypes() {
    return {
      y: PropTypes.number.isRequired,
      value: PropTypes.node.isRequired
    };
  }

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
  static get propTypes() {
    return {
      selectedTab: PropTypes.number.isRequired,
      loading: PropTypes.bool,
      height: PropTypes.number.isRequired,
      interval: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          timestamp: PropTypes.number.isRequired,
          price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired
        })
      ).isRequired,
      formatAmount: PropTypes.func.isRequired,
      onChangeTab: PropTypes.func.isRequired,
      containerStyle: styleProp,
      chartStyle: styleProp
    };
  }

  static get defaultProps() {
    return {
      height: 0,
      interval: 'DAY',
      data: []
    };
  }

  render() {
    if (this.props.loading) {
      return this.renderLoadingView();
    }

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
            height: this.getHeight(),
            padding: 0,
            marginHorizontal: 0
          },
          containerStyle
        ]}
      >
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
        <Tabs
          onPress={this.props.onChangeTab}
          selectedIndex={this.props.selectedTab}
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

  renderEmptyView() {
    const { containerStyle } = this.props;
    return (
      <View
        style={[
          styles.flex1,
          styles.fluff0,
          styles.mh2,
          styles.center,
          {
            height: this.getHeight()
          },
          containerStyle
        ]}
      >
        <MutedText style={{ textAlign: 'center' }}>No price history.</MutedText>
      </View>
    );
  }

  renderLoadingView() {
    const { containerStyle } = this.props;
    return (
      <View
        style={[
          {
            flex: 1,
            height: this.getHeight(),
            padding: 0,
            marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center'
          },
          containerStyle
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  getHeight() {
    let { height } = Dimensions.get('window');

    if (Platform.OS === 'ios') {
      const dim = Dimensions.get('window');

      // iPhone 5 -- 568x320
      // iPhone 8 plus -- 736x414
      // iPhone X -- 812x375
      // iPhone XR -- 896x375
      const isIphoneX =
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dim.height === 812 ||
          dim.width === 812 ||
          (dim.height === 896 || dim.width === 896));

      if (isIphoneX) {
        height = height - 172;
      } else {
        height = height - 114;
      }
    } else {
      height = height - 138;
    }

    return height;
  }
}
