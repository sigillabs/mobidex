import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListItem } from 'react-native-elements';
import { fonts, styles } from '../../../styles';

export default class ReceiptItem extends Component {
  static get propTypes() {
    return {
      index: PropTypes.number.isRequired,
      name: PropTypes.string,
      value: PropTypes.string.isRequired,
      denomination: PropTypes.string,
      profit: PropTypes.bool.isRequired,
      loss: PropTypes.bool.isRequired
    };
  }

  static get defaultProps() {
    return {
      profit: false,
      loss: false
    };
  }

  render() {
    return (
      <ListItem
        title={this.props.value}
        rightTitle={this.props.denomination}
        subtitle={this.props.name}
        topDivider={this.props.index === 0}
        bottomDivider={true}
        titleStyle={[
          fonts.large,
          this.props.loss ? styles.loss : null,
          this.props.profit ? styles.profit : null
        ]}
        subtitleStyle={[styles.mutedText]}
      />
    );
  }
}
