import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image } from 'react-native';
import { fonts, images, styles } from '../../styles';
import { getImage } from '../../utils';
import Col from '../components/Col';
import Row from '../components/Row';
import TokenBalanceBySymbol from './TokenBalanceBySymbol';

export default class LogoProductBalance extends Component {
  static get propTypes() {
    return {
      baseSymbol: PropTypes.string.isRequired,
      quoteSymbol: PropTypes.string.isRequired,
      adjusted: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      adjusted: true
    };
  }

  render() {
    const { baseSymbol, quoteSymbol } = this.props;

    return (
      <Col>
        <Row>
          <Col style={styles.flex0}>
            <Image
              source={getImage(baseSymbol)}
              style={[images.smallRounded, styles.mr1]}
              overlayColor={styles.background}
            />
          </Col>
          <Col style={styles.flex3} right>
            <TokenBalanceBySymbol
              symbol={baseSymbol}
              style={[fonts.large]}
              adjusted={this.props.adjusted}
            />
          </Col>
        </Row>
        <Row>
          <Col style={styles.flex0}>
            <Image
              source={getImage(quoteSymbol)}
              style={[images.smallRounded, styles.mr1]}
              overlayColor={styles.background}
            />
          </Col>
          <Col style={styles.flex3} right>
            <TokenBalanceBySymbol
              symbol={quoteSymbol}
              style={[fonts.large]}
              adjusted={this.props.adjusted}
            />
          </Col>
        </Row>
      </Col>
    );
  }
}
