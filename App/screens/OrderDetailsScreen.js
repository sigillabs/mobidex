import * as _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import NewOrderDetails from "../views/NewOrderDetails";

class OrderDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <NormalHeader navigation={navigation} />
    };
  };

  render() {
    const { navigation: { state: { params: { order } } } } = this.props;
    return (
      <NewOrderDetails order={order} />
    );
  }
}

export default connect(state => ({ ...state.wallet }), dispatch => ({ dispatch }))(OrderDetailsScreen);
