import * as _ from "lodash";
import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import ButtonGroup from './ButtonGroup.js'

class TokenFilterBar extends Component {
  renderGroup(title, tokens, selectedIndex, onPress) {
    return (
      <View style={styles.group}>
        <ButtonGroup
            onPress={(index) => {
              if (onPress) {
                onPress(tokens[index]);
              }
            }}
            selectedIndex={selectedIndex > -1 ? selectedIndex : 0}
            buttons={tokens.map(t => t.symbol)}
            containerBorderRadius={0}
            containerStyle={[styles.container, this.props.containerStyle]}
            buttonStyle={[styles.button, this.props.buttonStyles]}
        />
        <Text style={styles.groupText}>{title}</Text>
      </View>
    );
  }

  renderDivider() {
    return (
      <View style={styles.divider} />
    );
  }

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
        {this.renderGroup("Quote", quoteTokens, selectedQuoteTokenIndex, onQuoteTokenSelect)}
        {this.renderDivider()}
        {this.renderGroup("Base", baseTokens, selectedBaseTokenIndex, onBaseTokenSelect)}
      </ScrollView>
    );
  }
}

const styles = {
  divider: {
    backgroundColor: "gray",
    height: 30,
    width: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5
  },
  group: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  groupText: {
    color: "gray",
    fontSize: 10
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
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
