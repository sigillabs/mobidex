import * as _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import NormalHeader from "../headers/Normal";
import CancellableOrderDetails from "../components/CancellableOrderDetails";
import FillableOrderDetails from "../components/FillableOrderDetails";

class OrderDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <NormalHeader navigation={navigation} />
    };
  };

  render() {
    const { navigation: { state: { params: { order } } } } = this.props;
    const { address } = this.props;
    const isMine = order.maker === address;
    
    if (isMine) {
      return (
        <CancellableOrderDetails order={order} />
      );
    } else {
      return (
        <FillableOrderDetails order={order} />
      );
    }
  }
}

export default connect(state => ({ ...state.wallet }), dispatch => ({ dispatch }))(OrderDetailsScreen);
