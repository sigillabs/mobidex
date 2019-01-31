import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { fonts } from '../../styles';
import HorizontalPadding from '../components/HorizontalPadding';
import Row from '../components/Row';
import TokenIcon from '../components/TokenIcon';
import TokenBalanceBySymbol from './TokenBalanceBySymbol';

export default class LogoBalance extends Component {
  static get propTypes() {
    return {
      symbol: PropTypes.string.isRequired,
      avatarProps: PropTypes.shape({
        small: PropTypes.bool,
        medium: PropTypes.bool,
        large: PropTypes.bool,
        xlarge: PropTypes.bool
      })
    };
  }

  static get defaultProps() {
    return {
      avatarProps: {
        medium: true,
        rounded: true,
        activeOpacity: 0.7,
        overlayContainerStyle: { backgroundColor: 'transparent' }
      }
    };
  }

  render() {
    const { avatarProps, symbol } = this.props;

    return (
      <Row style={[style.container]}>
        <TokenIcon
          symbol={symbol}
          showName={false}
          showSymbol={false}
          {...avatarProps}
        />
        <HorizontalPadding size={10} />
        <TokenBalanceBySymbol symbol={symbol} style={[fonts.xlarge]} />
      </Row>
    );
  }
}

const style = {
  container: {
    backgroundColor: 'transparent',
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center'
  }
};
