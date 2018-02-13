import BigNumber from "bignumber.js";
import * as _ from "lodash";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import OrderItem from "./Item";

class AskItem extends Component {
  render() {
    let { order } = this.props;
    let { makerTokenAddress, makerTokenAmount, takerTokenAddress, takerTokenAmount } = order;
    let makerToken = _.find(this.props.tokens, { address: makerTokenAddress });
    let takerToken = _.find(this.props.tokens, { address: takerTokenAddress });
    let price = new BigNumber(takerTokenAmount).div(makerTokenAmount);
    let amount = new BigNumber(makerTokenAmount);

    return (
      <OrderItem orderType="ask" price={price} amount={amount} priceToken={takerToken} amountToken={makerToken} />
    );
  }
}

export default connect((state) => ({ ...state.settings, tokens: state.tokens }), (dispatch) => ({ dispatch }))(AskItem);