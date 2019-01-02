import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { fonts } from '../../styles';
import { getImage } from '../../utils';
import HorizontalPadding from '../components/HorizontalPadding';
import Row from '../components/Row';
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
      }),
      adjusted: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      avatarProps: {
        medium: true,
        rounded: true,
        activeOpacity: 0.7,
        overlayContainerStyle: { backgroundColor: 'transparent' }
      },
      adjusted: true
    };
  }

  render() {
    const { avatarProps, symbol } = this.props;

    return (
      <Row style={[style.container]}>
        <Avatar source={getImage(symbol)} {...avatarProps || {}} />
        <HorizontalPadding size={10} />
        <TokenBalanceBySymbol
          symbol={symbol}
          style={[fonts.xlarge]}
          adjusted={this.props.adjusted}
        />
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
