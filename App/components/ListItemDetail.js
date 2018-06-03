import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListItem, Text } from 'react-native-elements';
import Row from './Row';

export default class ListItemDetail extends Component {
  render() {
    const {
      left,
      right,
      leftStyle,
      rightStyle,
      rowStyle,
      ...rest
    } = this.props;

    return (
      <ListItem
        title={
          <Row style={[{ flex: 1 }, rowStyle]}>
            <Text style={[{ flex: 1, textAlign: 'left' }, leftStyle]}>
              {left}
            </Text>
            <Text style={[{ flex: 1, textAlign: 'right' }, rightStyle]}>
              {right}
            </Text>
          </Row>
        }
        bottomDivider
        {...rest}
      />
    );
  }
}

ListItemDetail.propTypes = {
  left: PropTypes.string.isRequired,
  leftStyle: PropTypes.object,
  right: PropTypes.string.isRequired,
  rightStyle: PropTypes.object,
  rowStyle: PropTypes.object
};
