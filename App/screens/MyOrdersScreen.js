import * as _ from "lodash";
import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { setBaseToken, setQuoteToken } from "../../actions";
import { loadOrders } from "../../thunks";
import { productTokenAddresses } from "../../utils/orders";
import OrderList from "../views/OrderList";
import TokenFilterBar from "../views/TokenFilterBar";
import NormalHeader from "../headers/Normal";

class MyOrdersScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <NormalHeader navigation={navigation} />
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      filteredOrders: [],
      quoteTokens: [],
      baseTokens: []
    };
  }

  componentWillReceiveProps(nextProps) {
    let { address, tokens, orders, products, quoteToken, baseToken } = nextProps;

    let filteredOrders = orders
    .filter(order => order.maker === address || order.taker === address)
    .filter(order => order.makerTokenAddress === quoteToken.address || order.takerTokenAddress === quoteToken.address);
    let quoteTokens = productTokenAddresses(products, "tokenB").map(address => _.find(tokens, { address }));
    let baseTokens = productTokenAddresses(products, "tokenA").map(address => _.find(tokens, { address }));

    this.setState({ filteredOrders, quoteTokens, baseTokens });
  }

  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  render() {
    let { quoteToken, baseToken } = this.props;
    let { filteredOrders, quoteTokens, baseTokens } = this.state;
    let bids = filteredOrders
    .filter(({ makerTokenAddress }) => makerTokenAddress === this.props.quoteToken.address)
    .filter(({ takerTokenAddress }) => takerTokenAddress === this.props.baseToken.address);
    let asks = filteredOrders
    .filter(({ takerTokenAddress }) => takerTokenAddress === this.props.quoteToken.address)
    .filter(({ makerTokenAddress }) => makerTokenAddress === this.props.baseToken.address);

    return (
      <View>
        <TokenFilterBar
            quoteTokens={quoteTokens}
            baseTokens={baseTokens}
            selectedQuoteToken={quoteToken}
            selectedBaseToken={baseToken}
            onQuoteTokenSelect={quoteToken => this.props.dispatch(setQuoteToken(quoteToken))}
            onBaseTokenSelect={baseToken => this.props.dispatch(setBaseToken(baseToken))} />
        <ScrollView>
          <OrderList
              orders={bids}
              onPress={order => (this.props.navigation.navigate("OrderDetails", { order, quoteToken, baseToken }))}
              title={"Bids"}
              icon={"add"} />
          <OrderList
              orders={asks}
              onPress={order => (this.props.navigation.navigate("OrderDetails", { order, quoteToken, baseToken }))}
              title={"Asks"}
              icon={"remove"} />
        </ScrollView>
      </View>
    );
  }
}

export default connect((state) => ({ ...state.device, ...state.settings, ...state.wallet, ...state.relayer }), (dispatch) => ({ dispatch }))(MyOrdersScreen);
