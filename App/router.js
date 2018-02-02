import React, { Component } from "react";
import { ActionConst, Reducer, Router, Stack, Scene } from "react-native-router-flux";
import { connect } from "react-redux";
import { Loader, Onboarding, Menu, Accounts, Orders, OrderDetails, CreateOrder } from "./views";

const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    console.log("ACTION:", action);
    return defaultReducer(state, action);
  };
};

const getSceneStyle = () => ({
  backgroundColor: "#F5FCFF",
  shadowOpacity: 1,
  shadowRadius: 3
});

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

const ConnectedLoader = connect(mapStateToProps, mapDispatchToProps)(Loader);
const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(Menu);
const ConnectedOnboarding = connect(mapStateToProps, mapDispatchToProps)(Onboarding);
const ConnectedAccounts = connect(mapStateToProps, mapDispatchToProps)(Accounts);
const ConnectedOrders = connect(mapStateToProps, mapDispatchToProps)(Orders);
const ConnectedOrderDetails = connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
const ConnectedCreateOrder = connect(mapStateToProps, mapDispatchToProps)(CreateOrder);

export default class MobidexRouter extends Component {
  render() {
    return (
      <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle} uriPrefix={"mobidex.io"}>
        <Stack key="root">
          <Scene key="loading" component={ConnectedLoader} hideNavBar />
          <Scene key="onboarding" path="/onboarding" title="Onboarding" component={ConnectedOnboarding} hideNavBar />
          <Scene key="accounts" path="/accounts" title="Accounts" component={ConnectedAccounts} />
          <Scene key="orders" path="/orders" title="Trade View" component={ConnectedOrders} />
          <Scene key="createOrder" path="/orders/create" title="Create Order" component={ConnectedCreateOrder} />
          <Scene key="orderDetails" path="/order/:orderHash/details" title="Order Details" component={ConnectedOrderDetails} />
          <Scene key="menu" component={ConnectedMenu} hideNavBar />
        </Stack>
      </Router>
    );
  }
}