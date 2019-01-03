import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListItem } from 'react-native-elements';
import { styles } from '../../../../styles';
import Col from '../../../components/Col';
import Row from '../../../components/Row';
import MutedText from '../../../components/MutedText';
import TokenIcon from '../../../components/TokenIcon';

export default class TokenItem extends Component {
  static get propTypes() {
    return {
      baseToken: PropTypes.object.isRequired,
      quoteToken: PropTypes.object.isRequired,
      change: PropTypes.node.isRequired,
      price: PropTypes.node.isRequired
    };
  }

  render() {
    const { baseToken } = this.props;

    return (
      <ListItem
        roundAvatar
        bottomDivider
        title={
          <Row style={[styles.flex1, styles.center, styles.mh2]}>
            <Col style={[styles.flex1, styles.alignLeft]}>
              <TokenIcon
                token={baseToken}
                style={{ flex: 0 }}
                showName={false}
                showSymbol={true}
              />
            </Col>
            <Col style={[styles.flex2]}>
              {this.props.price}
              <MutedText>Price</MutedText>
            </Col>
            <Col style={[styles.flex2]}>
              {this.props.change}
              <MutedText>24 Hour Change</MutedText>
            </Col>
          </Row>
        }
        hideChevron={true}
      />
    );
  }
}
