import * as _ from "lodash";
import React, { Component } from "react";
import { ScrollView } from "react-native";
import { ButtonGroup } from "react-native-elements";
import { connect } from "react-redux";

class TokenFilterBar extends Component {
  render() {
    let { tokens, selected } = this.props;
    let selectedIndex = _.indexOf(tokens, selected);
    return (
      <ScrollView horizontal={true}>
        <ButtonGroup
            onPress={(index) => {
              if (this.props.onPress) {
                this.props.onPress(tokens[index]);
              }
            }}
            selectedIndex={selectedIndex > -1 ? selectedIndex : 0}
            buttons={tokens.map(t => t.symbol)}
            containerBorderRadius={0}
            containerStyle={[styles.container, this.props.containerStyle]}
            buttonStyle={[styles.button, this.props.buttonStyles]}
        />
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    borderRadius: 0,
    borderWidth: 0,
    height: 40,
    padding: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10
  }
};

export default connect((state) => ({ ...state.device }), (dispatch) => ({ dispatch }))(TokenFilterBar);
