import React, { Component } from "react";
import { View } from "react-native";
import { Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { generateWallet, lock, unlock } from "../thunks";
import Unlock from "./views/Unlock";
import ImportPrivateKey from "./views/ImportPrivateKey";
import GenerateWallet from "./views/GenerateWallet";
import ButtonGroup from "./components/ButtonGroup";

class Locked extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0
    };
  }


  render() {
    let renderedTab = null;

    switch(this.state.tab) {
    case 0:
      renderedTab = <Unlock {...this.props} />;
      break;

    case 1:
      renderedTab = <ImportPrivateKey {...this.props} />;
      break;

    case 2:
      renderedTab = <GenerateWallet {...this.props} />;
      break;
    }

    return (
      <View style={{ height: this.props.height - 20, paddingTop: 20 }}>
        <ButtonGroup
          onPress={(index) => {
            this.setState({ tab: index });
          }}
          selectedIndex={this.state.tab}
          buttons={[ "Unlock", "Import", "New" ]} />
        {renderedTab}
      </View>
    );
  }
}

export default connect((state) => ({ ...state.device.layout }), dispatch => ({ dispatch }))(Locked);
