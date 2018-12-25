import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import BigCenter from '../components/BigCenter';
import VerticalPadding from '../components/VerticalPadding';

export default class Loading extends Component {
  static get propTypes() {
    return {
      label: PropTypes.string
    };
  }

  render() {
    return (
      <BigCenter>
        <ActivityIndicator />
        {this.renderLabelFragment()}
      </BigCenter>
    );
  }

  renderLabelFragment() {
    if (!this.props.label) return null;

    return (
      <Fragment>
        <VerticalPadding size={25} />
        <Text>{this.props.label}</Text>
      </Fragment>
    );
  }
}
