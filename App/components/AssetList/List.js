import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import AssetItem from "./Item";

class AssetList extends Component {
  render() {
    return (
      <List containerStyle={{
        marginBottom: 20,
        flex: 1,
        width: this.props.width
      }}>
        {
          this.props.tokens
          .filter(({ address }) => (Boolean(this.props.assets[token.address])))
          .map((token, index) => (
            <TouchableOpacity key={`asset-${index}`} onPress={() => (this.props.onPress(order))}>
              <ListItem
                title={<AssetItem token={token} balance={this.props.assets[token.address]} />}
                leftIcon={{ name: "add" }}
              />
            </TouchableOpacity>
          ))
        }
      </List>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings, tokens: state.tokens, assets: state.assets }), (dispatch) => ({ dispatch }))(AssetList);
