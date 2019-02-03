import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { colors } from '../../../styles';

export default class SectionHeader extends Component {
  static get propTypes() {
    return {
      title: PropTypes.string.isRequired
    };
  }

  render() {
    return (
      <ListItem
        title={this.props.title}
        containerStyle={style.container}
        topDivider={this.props.title === 'Wallet'}
      />
    );
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.grey6
  }
});
