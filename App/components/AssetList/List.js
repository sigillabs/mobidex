import * as _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import AssetItem from "./Item";

class AssetList extends Component {
  render() {
    let { assets, asset } = this.props;

    return (
      <ScrollView>
        <List containerStyle={[{
          width: this.props.width
        }, this.props.style]}>
          {
            assets.map((asset, index) => (
              <TouchableOpacity key={`asset-${index}`} onPress={() => (this.props.onPress(asset))}>
                <ListItem
                  containerStyle={[ this.props.asset && this.props.asset.address === asset.address && styles.highlight ]}
                  title={<AssetItem asset={asset} />}
                  leftIcon={{ name: "add" }}
                />
              </TouchableOpacity>
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

export default connect((state) => ({ ...state.device.layout, ...state.settings }), (dispatch) => ({ dispatch }))(AssetList);

const styles = {
  highlight: {
    backgroundColor: "#2089dc",
    borderColor: "#2089dc",
    borderWidth: 1
  }
};