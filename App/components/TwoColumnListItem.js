import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListItem, Text } from 'react-native-elements';
import { styleProp } from '../../types/props';
import Row from './Row';

export default class TwoColumnListItem extends Component {
  render() {
    const rest = _.omit(this.props, [
      'left',
      'leftHeader',
      'leftHeaderStyle',
      'leftStyle',
      'right',
      'rightHeader',
      'rightHeaderStyle',
      'rightStyle',
      'rowStyle'
    ]);

    return (
      <ListItem
        title={this.renderTitle()}
        subtitle={this.renderSubtitle()}
        bottomDivider
        {...rest}
      />
    );
  }

  renderTitle() {
    const { left, right, leftStyle, rightStyle, rowStyle } = this.props;
    let leftElement = left;
    let rightElement = right;

    if (typeof left === 'string') {
      leftElement = (
        <Text style={[{ flex: 1, textAlign: 'left' }, leftStyle]}>{left}</Text>
      );
    }

    if (typeof right === 'string') {
      rightElement = (
        <Text style={[{ flex: 1, textAlign: 'right' }, rightStyle]}>
          {right}
        </Text>
      );
    }

    return (
      <Row style={[{ flex: 1 }, rowStyle]}>
        {leftElement}
        {rightElement}
      </Row>
    );
  }

  renderSubtitle() {
    const {
      leftHeader,
      rightHeader,
      leftHeaderStyle,
      rightHeaderStyle,
      rowStyle
    } = this.props;

    if (!leftHeader && !rightHeader) {
      return null;
    }

    return (
      <Row style={[{ flex: 1 }, rowStyle]}>
        <Text style={[{ flex: 1, textAlign: 'left' }, leftHeaderStyle]}>
          {leftHeader}
        </Text>
        <Text style={[{ flex: 1, textAlign: 'right' }, rightHeaderStyle]}>
          {rightHeader}
        </Text>
      </Row>
    );
  }
}

TwoColumnListItem.propTypes = {
  left: PropTypes.node.isRequired,
  leftHeader: PropTypes.string,
  leftHeaderStyle: styleProp,
  leftStyle: styleProp,
  right: PropTypes.node.isRequired,
  rightHeader: PropTypes.string,
  rightHeaderStyle: styleProp,
  rightStyle: styleProp,
  rowStyle: styleProp
};
