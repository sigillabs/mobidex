import PropTypes from "prop-types";
import React from "react";
import { connect as connectNavigation } from "../../../../navigation";
import { styles } from "../../../../styles";
import { navigationProp } from "../../../../types/props";
import { formatProduct, isValidAmount } from "../../../../utils";
import TokenAmount from "../../../components/TokenAmount";
import OneButtonTokenAmountKeyboardLayout from "../../../layouts/OneButtonTokenAmountKeyboardLayout";
import OrderbookPrice from "../../../views/OrderbookPrice";

class FillOrders extends OneButtonTokenAmountKeyboardLayout {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      side: PropTypes.string.isRequired,
      base: PropTypes.object.isRequired,
      quote: PropTypes.object.isRequired
    };
  }

  renderTop() {
    const { side } = this.props;

    return (
      <React.Fragment>
        <TokenAmount
          containerStyle={[styles.flex4, styles.mv2, styles.mr2, styles.p0]}
          symbol={this.props.base.symbol}
          label={side === "buy" ? "Buying" : "Selling"}
          amount={this.state.amount.join("")}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          format={false}
        />
        <TokenAmount
          label={"price"}
          amount={
            <OrderbookPrice
              product={formatProduct(
                this.props.base.symbol,
                this.props.quote.symbol
              )}
              default={0}
              side={this.props.side}
            />
          }
          format={false}
          symbol={this.props.quote.symbol}
        />
      </React.Fragment>
    );
  }

  getKeyboardProps() {
    return {
      decimal:
        this.state.amount.indexOf(".") === -1 && this.state.amount.length > 0
    };
  }

  getButtonProps() {
    return {
      title:
        this.props.side === "buy" ? "Preview Buy Order" : "Preview Sell Order"
    };
  }

  press() {
    const { amount } = this.state;
    const amountString = amount.join("");

    if (amountString && isValidAmount(amountString)) {
      const { side, base, quote } = this.props;

      this.props.navigation.showModal("modals.PreviewOrder", {
        type: "fill",
        side,
        amount: amountString,
        base,
        quote
      });
    }
  }
}

export default connectNavigation(FillOrders);
