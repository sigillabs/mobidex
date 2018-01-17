import * as _ from "lodash";
import React, { Component } from "react";
import { AppRegistry, Dimensions, StyleSheet, Text, View } from "react-native";
import { NativeRouter as Router, Route, Link } from "react-router-native";
import { connect, Provider } from "react-redux";
import { createStore } from "redux";
import { configureStore } from "./store";
import { Main, Accounts, Orders, OrderDetails, CreateOrder } from "./views";

const STORE = configureStore();

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

const ConnectedMain = connect(mapStateToProps, mapDispatchToProps)(Main);
const ConnectedAccounts = connect(mapStateToProps, mapDispatchToProps)(Accounts);
const ConnectedOrders = connect(mapStateToProps, mapDispatchToProps)(Orders);
const ConnectedOrderDetails = connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
const ConnectedCreateOrder = connect(mapStateToProps, mapDispatchToProps)(CreateOrder);

export default class Mobidex extends Component {
  render () {
    return (
      <Provider store={STORE}>
        <View style={styles.container}>
          <Router>
            <View>
              <Route path="/" component={ConnectedMain} exact />
              <Route path="/accounts" component={ConnectedAccounts} exact />
              <Route path="/orders" component={ConnectedOrders} exact />
              <Route path="/orders/create" component={ConnectedCreateOrder} exact />
              <Route path="/orders/:id/details" component={ConnectedOrderDetails} exact />
            </View>
          </Router>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  }
})
