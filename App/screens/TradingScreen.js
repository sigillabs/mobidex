import * as _ from "lodash";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { setBaseToken, setQuoteToken } from "../../actions";
import { loadOrders } from "../../thunks";
import OrderList from "../components/OrderList";
import TradingInfo from "../components/TradingInfo";
import TokenFilterBar from "../components/TokenFilterBar";

class TradingScreen extends Component {
  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  filteredOrders() {
    return this.props.orders.filter(order => order.makerTokenAddress === this.props.quoteToken.address || order.takerTokenAddress === this.props.quoteToken.address)
  }

  quoteTokens() {
    return _.uniqBy(this.props.products.map(p => p.tokenB).map(t => _.find(this.props.tokens, { address: t.address })), "address");
  }

  baseTokens() {
    return _.uniqBy(this.props.products.map(p => p.tokenA).map(t => _.find(this.props.tokens, { address: t.address })), "address");
  }

  render() {
    let { quoteToken, baseToken } = this.props;
    let quoteTokens = this.quoteTokens();
    let baseTokens = this.baseTokens();
    let orders = this.filteredOrders();

    return (
      <View>
        <TokenFilterBar
            quoteTokens={quoteTokens}
            baseTokens={baseTokens}
            selectedQuoteToken={quoteToken}
            selectedBaseToken={baseToken}
            onQuoteTokenSelect={quoteToken => this.props.dispatch(setQuoteToken(quoteToken))}
            onBaseTokenSelect={baseToken => this.props.dispatch(setBaseToken(baseToken))} />
        <TradingInfo orders={orders} />
        <OrderList
            quoteToken={quoteToken}
            baseToken={baseToken}
            orders={orders}
            onPress={order => (this.props.navigation.navigate("OrderDetails", { order, quoteToken, baseToken }))} />
      </View>
    );
  }
}

export default connect((state) => ({ ...state.device, ...state.relayer, ...state.settings }), (dispatch) => ({ dispatch }))(TradingScreen);
