import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import { getTokenByAddress } from "../../../utils/ethereum";
import { formatAmountWithDecimals } from "../../../utils/display";

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

    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.datum}>{formatAmountWithDecimals(price, priceToken.decimals)} {priceToken.symbol}</Text>
          <Text style={styles.datum}>{formatAmountWithDecimals(amount, amountToken.decimals)} {amountToken.symbol}</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.header}>Price</Text>
          <Text style={styles.header}>Amount</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
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

export default connect((state) => ({ ...state.wallet }), (dispatch) => ({ dispatch }))(OrderItem);
