import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListItem, Text } from 'react-native-elements';
import Row from '../../../components/Row';

export default class ProductDetailListItem extends Component {
  static get propTypes() {
    return {
      left: PropTypes.node,
      right: PropTypes.node,
      leftStyle: PropTypes.object,
      rightStyle: PropTypes.object
    };
  }

  render() {
    const { left, right, leftStyle, rightStyle, ...rest } = this.props;

    return (
      <ListItem
        title={
          <Row style={{ flex: 1 }}>
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
