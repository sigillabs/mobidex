import BigNumber from "bignumber.js";
import React, { Component } from "react";
import OrderItem from "./Item";

export default class BidItem extends Component {
  render() {
    let { order } = this.props;
    let { makerTokenAddress, makerTokenAmount, takerTokenAddress, takerTokenAmount } = order;
    let price = new BigNumber(makerTokenAmount).div(takerTokenAmount);
    let amount = new BigNumber(takerTokenAmount);

    return (
      <OrderItem orderType="bid" price={price} amount={amount} priceTokenAddress={makerTokenAddress} amountTokenAddress={takerTokenAddress} />
    );
  }
}
