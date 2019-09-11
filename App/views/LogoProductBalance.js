import React, { Component } from 'react';
import { styles } from '../../styles';
import * as AssetService from '../../services/AssetService';
import { addressProp } from '../../types/props';
import Col from '../components/Col';
import Row from '../components/Row';
import TokenIcon from '../components/TokenIcon';
import FormattedSymbol from '../components/FormattedSymbol';

export default class LogoProductBalance extends Component {
  static get propTypes() {
    return {
      token: addressProp.isRequired
    };
  }

  render() {
    const { token } = this.props;
    const asset = AssetService.findAssetByAddress(token);

    return (
      <Col style={{ backgroundColor: 'transparent', width: 200 }}>
        <Row style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <Col style={styles.flex0}>
            <TokenIcon
              address={token}
              size={20}
              showName={false}
              showSymbol={false}
            />
          </Col>
          <Col style={[styles.flex3]} right />
          <Col style={styles.flex0} right>
            <FormattedSymbol symbol={asset.symbol} />
          </Col>
        </Row>
        <Row>
          <Col style={styles.flex0}>
            <TokenIcon
              address={token}
              size={20}
              showName={false}
              showSymbol={false}
            />
          </Col>
        </Row>
      </Col>
    );
  }
}
