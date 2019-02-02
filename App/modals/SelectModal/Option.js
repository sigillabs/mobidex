import PropTypes from 'prop-types';
import React from 'react';
import { ListItem } from 'react-native-elements';

export default class Option extends React.PureComponent {
  static get propTypes() {
    return {
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
      selected: PropTypes.bool.isRequired,
      onPress: PropTypes.func.isRequired
    };
  }

  render() {
    const icon = {
      name: this.props.selected ? 'circle' : 'circle-o',
      type: 'font-awesome'
    };
    return (
      <ListItem
        onPress={this.onPress}
        leftIcon={icon}
        title={this.props.label}
        bottomDivider={true}
        topDivider={this.props.index === 0}
      />
    );
  }

  onPress = () => {
    this.props.onPress(this.props.name);
  };
}
