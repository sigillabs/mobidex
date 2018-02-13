import BigNumber from "bignumber.js";
import * as _ from "lodash";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import OrderItem from "./Item";

class BidItem extends Component {
  render() {
    let { order } = this.props;
    let { makerTokenAddress, makerTokenAmount, takerTokenAddress, takerTokenAmount } = order;
    let makerToken = _.find(this.props.tokens, { address: makerTokenAddress });
    let takerToken = _.find(this.props.tokens, { address: takerTokenAddress });
    let price = new BigNumber(makerTokenAmount).div(takerTokenAmount);
    let amount = new BigNumber(takerTokenAmount);

    return (
      <OrderItem orderType="bid" price={price} amount={amount} priceToken={makerToken} amountToken={takerToken} />
    );
  }
}

export default connect((state) => ({ ...state.settings, tokens: state.tokens }), (dispatch) => ({ dispatch }))(BidItem);