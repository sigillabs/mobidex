import * as _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { getImage } from "../../../utils/display";
import AssetItem from "./Item";

class AssetList extends Component {
  render() {
    let { assets } = this.props;

    return (
      <List containerStyle={[{
        width: this.props.width
      }, this.props.style]}>
        {
          assets.map((asset, index) => (
            <TouchableOpacity key={`asset-${index}`} onPress={() => (this.props.onPress(asset))}>
              <ListItem
                roundAvatar
                avatar={getImage(asset.symbol)}
                title={<AssetItem asset={asset} />}
                avatarOverlayContainerStyle={{ backgroundColor: "transparent" }}
                containerStyle={[ this.props.asset && this.props.asset.address === asset.address && styles.highlight ]}
              />
            </TouchableOpacity>
          ))
        }
      </List>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings }), (dispatch) => ({ dispatch }))(AssetList);

const styles = {
  highlight: {
    backgroundColor: "#86939e",
    borderColor: "#86939e",
    borderWidth: 1
  }
};
