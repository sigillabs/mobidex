import BigNumber from "bignumber.js";
import React, { Component } from "react";
import OrderItem from "./Item";

export default class AskItem extends Component {
  render() {
    let { order } = this.props;
    let { makerTokenAddress, makerTokenAmount, takerTokenAddress, takerTokenAmount } = order;
    let price = new BigNumber(takerTokenAmount).div(makerTokenAmount);
    let amount = new BigNumber(makerTokenAmount);

    return (
      <OrderItem orderType="ask" price={price} amount={amount} priceTokenAddress={takerTokenAddress} amountTokenAddress={makerTokenAddress} />
    );
  }
}
