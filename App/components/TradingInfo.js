import BigNumber from "bignumber.js";
import * as _ from "lodash";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text, Overlay, List, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { formatAmountWithDecimals } from "../../utils/display";
import { findHighestBid, findLowestAsk, calculateBidPrice, calculateAskPrice } from "../../utils/orders";

class TradingInfo extends Component {
  render() {
    let highestBid = findHighestBid(this.props.orders, this.props.quoteToken);
    let lowestAsk = findLowestAsk(this.props.orders, this.props.quoteToken);
    let highestBidPrice = highestBid !== null ? calculateBidPrice(highestBid) : new BigNumber(0);
    let lowestAskPrice = lowestAsk !== null ? calculateAskPrice(lowestAsk) : new BigNumber(0);
    let spread = lowestAskPrice.sub(highestBidPrice);

    return (
      <View style={{ height: 60 }}>
        <View style={styles.row}>
          <Text style={styles.datum}>{formatAmountWithDecimals(highestBidPrice, this.props.quoteToken.decimals)}</Text>
          <Text style={styles.datum}>{formatAmountWithDecimals(lowestAskPrice, this.props.quoteToken.decimals)}</Text>
          <Text style={styles.datum}>{formatAmountWithDecimals(spread, this.props.quoteToken.decimals)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.header}>Highest Bid</Text>
          <Text style={styles.header}>Lowest Ask</Text>
          <Text style={styles.header}>Bid/Ask Spread</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  datum: {
    textAlign: "center",
    flex: 1
  },
  header: {
    textAlign: "center",
    color: "gray",
    flex: 1,
    fontSize: 10
  }
};

export default connect(state => ({ ...state.device.layout, tokens: state.relayer.tokens }), dispatch => ({ dispatch }))(TradingInfo);
