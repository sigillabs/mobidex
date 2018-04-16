import React, { Component } from 'react';
import ButtonGroup from '../components/ButtonGroup.js';

const BUTTONS = ['Mine', 'Bids', 'Asks'];

export default class OrderFilterBar extends Component {
  render() {
    return (
      <ButtonGroup
        onPress={index => {
          if (this.props.onSelect)
            this.props.onSelect(BUTTONS[index].toLowerCase());
        }}
        selectedIndex={BUTTONS.map(b => b.toLowerCase()).indexOf(
          this.props.selected
        )}
        buttons={BUTTONS}
        containerBorderRadius={0}
        containerStyle={[
          {
            borderRadius: 0,
            borderWidth: 0,
            height: 40,
            padding: 0,
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0
          },
          this.props.containerStyle
        ]}
      />
    );
  }
}
