import React, { Component } from "react";
import { connect } from "react-redux";
import { addNavigationHelpers } from "react-navigation";
import { createReduxBoundAddListener } from "react-navigation-redux-helpers";
import Navigator from "../navigation";

const addListener = createReduxBoundAddListener("root");

class Main extends Component {
  render() {
    return (
      <Navigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.navigation,
        addListener,
      })} />
    );
  }
}

export default connect((state) => ({ navigation: state.navigation }), (dispatch) => ({ dispatch }))(Main);