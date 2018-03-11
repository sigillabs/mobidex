import React, { Component } from "react";
import reactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";

@reactMixin.decorate(TimerMixin)
export default class extends Component {
  render() {
    return (
      <Header
        backgroundColor= "#43484d"
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={(
          <TouchableOpacity onPress={() => this.requestAnimationFrame(() => {
            this.props.navigation.goBack(null);
          })}>
            <Icon name="arrow-back" color="white" />
          </TouchableOpacity>
        )}
        centerComponent={{ text: "Mobidex", style: { color: "white", fontSize:15 } }} />
    );
  }
}
