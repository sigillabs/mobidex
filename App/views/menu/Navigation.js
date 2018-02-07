import React, { Component } from "react";
import { TouchableHighlight } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { gotoOrders } from "../../thunks"

export class Navigation extends Component {
  render() {
    return (
      <List containerStyle={{
        width: this.props.width
      }}>
        <TouchableHighlight onPress={() => (Actions.accounts())}>
          <ListItem
            title="Wallet"
            leftIcon={{ name: "av-timer" }}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => (this.props.dispatch(gotoOrders()))}>
          <ListItem
            title="Trade"
            leftIcon={{ name: "av-timer" }}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => (Actions.createOrder())}>
          <ListItem
            title="Create Order"
            leftIcon={{ name: "av-timer" }}
          />
        </TouchableHighlight>
      </List>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    width: state.device.layout.width
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

const ConnectedNavigation = connect(mapStateToProps, mapDispatchToProps)(Navigation);

export default ConnectedNavigation;
