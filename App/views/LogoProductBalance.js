import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { fonts, styles } from '../../styles';
import Col from '../components/Col';
import Row from '../components/Row';
import TokenIcon from '../components/TokenIcon';
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
      <Col style={{ backgroundColor: 'transparent', width: 150 }}>
        <Row>
          <Col style={styles.flex0}>
            <TokenIcon
              symbol={baseSymbol}
              size={20}
              showName={false}
              showSymbol={false}
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
            <TokenIcon
              symbol={quoteSymbol}
              size={20}
              showName={false}
              showSymbol={false}
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
