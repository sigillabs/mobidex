import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListItem, Text } from 'react-native-elements';
import Row from './Row';

export default class ListItemDetail extends Component {
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

    return (
      <Row style={[{ flex: 1 }, rowStyle]}>
        <Text style={[{ flex: 1, textAlign: 'left' }, leftStyle]}>{left}</Text>
        <Text style={[{ flex: 1, textAlign: 'right' }, rightStyle]}>
          {right}
        </Text>
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

ListItemDetail.propTypes = {
  left: PropTypes.string.isRequired,
  leftHeader: PropTypes.string,
  leftHeaderStyle: PropTypes.object,
  leftStyle: PropTypes.object,
  right: PropTypes.string.isRequired,
  rightHeader: PropTypes.string,
  rightHeaderStyle: PropTypes.object,
  rightStyle: PropTypes.object,
  rowStyle: PropTypes.object
};
