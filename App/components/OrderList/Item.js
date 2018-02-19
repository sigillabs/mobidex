import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import { getTokenByAddress } from "../../../utils/ethereum";

class OrderItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      priceToken: null,
      amountToken: null
    };
  }

  async componentDidMount() {
    this.setState({
      ready: true,
      priceToken: await getTokenByAddress(this.props.web3, this.props.priceTokenAddress),
      amountToken: await getTokenByAddress(this.props.web3, this.props.amountTokenAddress)
    });
  }

  render() {
    if (!this.state.ready) {
      return null;
    }

    let { orderType, price, amount } = this.props;
    let { priceToken, amountToken } = this.state;
    let priceSymbol = priceToken.symbol;
    let amountSymbol = amountToken.symbol;

    return (
      <View style={[{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", }]}>
        {orderType === "bid" ? 
            (<Text>Bid </Text>)
          : (<Text>Ask </Text>)}
        <Text>{amount.toString()} {amountSymbol}</Text>
        <Text> for </Text>
        <Text>{price.toString()} {priceSymbol}</Text>
      </View>
    );
  }
}

export default connect((state) => ({ ...state.wallet }), (dispatch) => ({ dispatch }))(OrderItem);
