import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';

export default class VerticalPadding extends Component {
  static get propTypes() {
    return { size: PropTypes.number.isRequired };
  }

  render() {
    return (
      <View
        style={{
          width: this.props.size,
          height: '100%'
        }}
      />
    );
  }
}
