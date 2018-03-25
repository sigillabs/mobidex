import * as _ from "lodash";
import React, { Component } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { Avatar } from "react-native-elements";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { setBaseToken, setQuoteToken } from "../../actions";
import { loadOrders } from "../../thunks";
import { productTokenAddresses } from "../../utils/orders";
import BigCenter from "../components/BigCenter";
import ButtonGroup from "../components/ButtonGroup.js";
import Divider from "../components/Divider";
import EmptyList from "../components/EmptyList";
import MutedText from "../components/MutedText";
import OrderFilterBar from "../views/OrderFilterBar";
import OrderList from "../views/OrderList";
import TradingInfo from "../views/TradingInfo";
import TokenFilterBar from "../views/TokenFilterBar";

class TradingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredOrders: [],
      quoteTokens: [],
      baseTokens: [],
      orderFilter: null,
      refreshing: false
    };
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadOrders());
    this.setState({ refreshing: false });
  };

  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  componentWillReceiveProps(nextProps) {
    let { tokens, orders, products, quoteToken } = nextProps;

    let filteredOrders = orders
      .filter(order => order.makerTokenAddress === quoteToken.address || order.takerTokenAddress === quoteToken.address);

    let quoteTokens = productTokenAddresses(products, "tokenB").map(address => _.find(tokens, { address }));
    let baseTokens = productTokenAddresses(products, "tokenA").map(address => _.find(tokens, { address }));

    this.setState({ filteredOrders, quoteTokens, baseTokens });
  }

  render() {
    let { quoteToken, baseToken, address } = this.props;
    let { filteredOrders, quoteTokens, baseTokens, orderFilter } = this.state;
    let bids = filteredOrders
      .filter(({ makerTokenAddress }) => makerTokenAddress === this.props.quoteToken.address)
      .filter(({ takerTokenAddress }) => takerTokenAddress === this.props.baseToken.address);
    let asks = filteredOrders
      .filter(({ takerTokenAddress }) => takerTokenAddress === this.props.quoteToken.address)
      .filter(({ makerTokenAddress }) => makerTokenAddress === this.props.baseToken.address);

    if (orderFilter === "filter") {
      bids = bids.filter(order => order.maker === address);
      asks = asks.filter(order => order.maker === address);
    } else if (orderFilter === "bids") {
      asks = [];
    } else if (orderFilter === "asks") {
      bids = [];
    }

    return (
      <ScrollView refreshControl={(
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh.bind(this)}
        />
      )}>
        <TokenFilterBar
          quoteTokens={quoteTokens}
          baseTokens={baseTokens}
          selectedQuoteToken={quoteToken}
          selectedBaseToken={baseToken}
          onQuoteTokenSelect={quoteToken => this.props.dispatch(setQuoteToken(quoteToken))}
          onBaseTokenSelect={baseToken => this.props.dispatch(setBaseToken(baseToken))} />
        <TradingInfo orders={filteredOrders} />
        <OrderFilterBar
          selected={this.state.orderFilter}
          onSelect={(button) => this.setState({ orderFilter: orderFilter !== button ? button : null })}
          containerStyle={{ marginBottom: 10 }} />

        {bids.length === 0 && asks.length === 0 ? (
          <EmptyList style={{ height: "100%", width: "100%" }} onPress={() => this.props.navigation.navigate("CreateOrder")}>
            <MutedText style={{ marginBottom: 25, fontSize: 24 }}>Get started trading!</MutedText>
            <Avatar
              xlarge
              rounded
              icon={{name: "plus", type: "font-awesome"}}
              activeOpacity={0.7}
            />
          </EmptyList>
        ) : null}

        {bids.length !== 0 ? <OrderList
          orders={bids}
          onPress={order => (this.props.navigation.navigate("OrderDetails", { order, quoteToken, baseToken }))}
          title={"Bids"}
          icon={"add"} /> : null}

        {asks.length !== 0 ? <OrderList
          orders={asks}
          onPress={order => (this.props.navigation.navigate("OrderDetails", { order, quoteToken, baseToken }))}
          title={"Asks"}
          icon={"remove"} /> : null}
      </ScrollView>
    );
  }
}

export default connect((state) => ({ ...state.device, ...state.settings, ...state.wallet, ...state.relayer }), (dispatch) => ({ dispatch }))(TradingScreen);
