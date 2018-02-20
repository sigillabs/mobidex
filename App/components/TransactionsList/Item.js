import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import { getTokenByAddress } from "../../../utils/ethereum";

class FinishedTransactionItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      makerToken: null,
      takerToken: null,
      ready: false
    };
  }

  async componentDidMount() {
    let [ makerToken, takerToken ] = await Promise.all([
      getTokenByAddress(this.props.web3, this.props.transaction.makerToken),
      getTokenByAddress(this.props.web3, this.props.transaction.takerToken)
    ]);
    
    this.setState({
      makerToken,
      takerToken,
      ready: true
    });
  }

  render() {
    if (!this.state.ready) {
      return null;
    }

    let { filledMakerTokenAmount, filledTakerTokenAmount } = this.props.transaction;
    let { makerToken, takerToken } = this.state;

    return (
      <View style={[{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", }]}>
        <Text>{filledMakerTokenAmount} {makerToken.symbol}</Text>
        <Text> for </Text>
        <Text>{filledTakerTokenAmount} {takerToken.symbol}</Text>
      </View>
    );
  }
}

export default connect(state => ({ ...state.wallet, ...state.device.layout }), dispatch => ({ dispatch }))(FinishedTransactionItem);
