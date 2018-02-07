import Wallet from "ethereumjs-wallet";
import React, { Component } from "react";
import { AsyncStorage, View, Text } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { setWallet } from "../../actions";
import { loadTokens } from "../../thunks";

class StartupScreen extends Component {
  async componentDidMount() {
    let privateKey = await AsyncStorage.getItem("wallet");
    if (privateKey) {
      let wallet = Wallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
      await Promise.all([
        this.props.dispatch(setWallet(wallet)),
        this.props.dispatch(loadTokens(this.props.web3))
      ]);

      this.props.finish();

      // this.props.navigator.push({
      //   screen: "mobidex.TradingScreen"
      // });
    } else {
      this.props.navigator.push({
        screen: "mobidex.OnboardingScreen"
      });
    }
  }

  render() {
    return (
      <View>
        <Text>Starting Up!</Text>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.ethereum.web3
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StartupScreen);
