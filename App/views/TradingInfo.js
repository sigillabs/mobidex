import BigNumber from "bignumber.js";
import * as _ from "lodash";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text, Overlay, List, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { formatAmount } from "../../utils/display";
import { findHighestBid, findLowestAsk, calculateBidPrice, calculateAskPrice } from "../../utils/orders";
import Row from "../components/Row";

class TradingInfo extends Component {
  render() {
    let highestBid = findHighestBid(this.props.orders, this.props.quoteToken, this.props.baseToken);
    let lowestAsk = findLowestAsk(this.props.orders, this.props.quoteToken, this.props.baseToken);
    let highestBidPrice = highestBid !== null ? calculateBidPrice(highestBid, this.props.quoteToken, this.props.baseToken) : new BigNumber(0);
    let lowestAskPrice = lowestAsk !== null ? calculateAskPrice(lowestAsk, this.props.quoteToken, this.props.baseToken) : new BigNumber(0);
    let spread = lowestAskPrice.sub(highestBidPrice);

    return (
      <View style={styles.container}>
        <Row>
          <Text style={styles.datum}>{formatAmount(highestBidPrice)}</Text>
          <Text style={styles.datum}>{formatAmount(lowestAskPrice)}</Text>
          <Text style={styles.datum}>{formatAmount(spread)}</Text>
        </Row>
        <Row>
          <Text style={styles.header}>Highest Bid</Text>
          <Text style={styles.header}>Lowest Ask</Text>
          <Text style={styles.header}>Bid/Ask Spread</Text>
        </Row>
      </View>
    );
  }
}

const styles = {
  container: {
    height: 30,
    marginTop: 10,
    marginBottom: 10
  },
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

export default connect(state => ({ ...state.device.layout, ...state.settings, tokens: state.relayer.tokens }), dispatch => ({ dispatch }))(TradingInfo);
