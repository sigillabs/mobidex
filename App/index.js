import * as _ from "lodash";
import React, { Component } from "react";
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  NativeRouter as Router,
  Route,
  Link
} from "react-router-native";
import { connect, Provider } from "react-redux";
import { createStore } from "redux";
import { configureStore } from "./store";
import Index from "./views/Index";

const STORE = configureStore();

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

const ConnectedIndex = connect(mapStateToProps, mapDispatchToProps)(Index)

export default class Mobidex extends Component {
  render () {
    return (
      <Provider store={STORE}>
        <View style={styles.container}>
          <Router>
            <Route path="/" component={ConnectedIndex} />
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
