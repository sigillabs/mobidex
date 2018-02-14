import * as _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import AssetItem from "./Item";

class AssetList extends Component {
  render() {
    let { assets } = this.props;

    return (
      <List containerStyle={{
        marginBottom: 20,
        flex: 1,
        width: this.props.width
      }}>
        {
          assets.map((asset, index) => (
            <TouchableOpacity key={`asset-${index}`} onPress={() => (this.props.onPress(asset))}>
              <ListItem
                title={<AssetItem asset={asset} />}
                leftIcon={{ name: "add" }}
              />
            </TouchableOpacity>
          ))
        }
      </List>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings }), (dispatch) => ({ dispatch }))(AssetList);
