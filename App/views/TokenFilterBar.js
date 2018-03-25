import * as _ from "lodash";
import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import { colors } from "../../styles";
import ButtonGroup from "../components/ButtonGroup.js";

class TokenFilterBar extends Component {
  render() {
    let {
      quoteTokens,
      baseTokens,
      selectedQuoteToken,
      selectedBaseToken,
      onQuoteTokenSelect,
      onBaseTokenSelect
    } = this.props;
    let selectedQuoteTokenIndex = _.indexOf(quoteTokens, selectedQuoteToken);
    let selectedBaseTokenIndex = _.indexOf(baseTokens, selectedBaseToken);
    return (
      <ScrollView horizontal={true}>
        <TokenFilterBarButtonGroup
          title="Quote"
          tokens={quoteTokens}
          selectedIndex={selectedQuoteTokenIndex}
          onPress={onQuoteTokenSelect} />
        <View style={{
          backgroundColor: colors.grey3,
          height: 30,
          width: 1,
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5
        }} />
        <TokenFilterBarButtonGroup
          title="Base"
          tokens={baseTokens}
          selectedIndex={selectedBaseTokenIndex}
          onPress={onBaseTokenSelect} />
      </ScrollView>
    );
  }
}

class TokenFilterBarButtonGroup extends Component {
  render() {
    let { title, tokens, selectedIndex, onPress } = this.props;

    return (
      <View style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start"
      }}>
        <ButtonGroup
          onPress={(index) => {
            if (onPress) {
              onPress(tokens[index]);
            }
          }}
          selectedIndex={selectedIndex > -1 ? selectedIndex : 0}
          buttons={tokens.map(t => t.symbol)}
          containerBorderRadius={0}
          containerStyle={[{
            borderRadius: 0,
            borderWidth: 0,
            height: 40,
            padding: 0,
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0,
          }, this.props.containerStyle]}
          buttonStyle={[{
            paddingLeft: 10,
            paddingRight: 10
          }, this.props.buttonStyles]} />
        <Text style={{
          color: "gray",
          fontSize: 10
        }}>{title}</Text>
      </View>
    );
  }
}

export default connect((state) => ({ ...state.device }), (dispatch) => ({ dispatch }))(TokenFilterBar);
