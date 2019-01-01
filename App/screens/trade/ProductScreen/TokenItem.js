import PropTypes from "prop-types";
import React, { Component } from "react";
import { ListItem, Text } from "react-native-elements";
import { fonts, styles } from "../../../../styles";
import { formatPercent } from "../../../../utils";
import Col from "../../../components/Col";
import Row from "../../../components/Row";
import MutedText from "../../../components/MutedText";
import TokenIcon from "../../../components/TokenIcon";

export default class TokenItem extends Component {
  static get propTypes() {
    return {
      baseToken: PropTypes.object.isRequired,
      quoteToken: PropTypes.object.isRequired,
      price: PropTypes.number.isRequired,
      change: PropTypes.number.isRequired,
      priceFormatter: PropTypes.func.isRequired
    };
  }

  render() {
    const { baseToken, price, change, priceFormatter } = this.props;

    return (
      <ListItem
        roundAvatar
        bottomDivider
        title={
          <Row style={[styles.flex1, styles.center, styles.mh2]}>
            <Col style={[styles.flex1, styles.alignLeft]}>
              <TokenIcon
                token={baseToken}
                style={{ flex: 0 }}
                showName={false}
                showSymbol={true}
              />
            </Col>
            <Col style={[styles.flex2]}>
              <Text
                style={[fonts.large, change >= 0 ? styles.profit : styles.loss]}
              >
                {priceFormatter(price)}
              </Text>
              <MutedText>Price</MutedText>
            </Col>
            <Col style={[styles.flex2]}>
              <Text
                style={[fonts.large, change >= 0 ? styles.profit : styles.loss]}
              >
                {formatPercent(change)}
              </Text>
              <MutedText>24 Hour Change</MutedText>
            </Col>
          </Row>
        }
        hideChevron={true}
      />
    );
  }
}
