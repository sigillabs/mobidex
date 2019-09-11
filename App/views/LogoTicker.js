import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { formatSymbol } from '../../lib/utils';
import { connect } from 'react-redux';
import { fonts } from '../../styles';
import { addressProp } from '../../types/props';
import HorizontalPadding from '../components/HorizontalPadding';
import Row from '../components/Row';
import TokenIcon from '../components/TokenIcon';

class LogoTicker extends Component {
  static get propTypes() {
    return {
      base: PropTypes.shape({
        symbol: PropTypes.string.isRequired
      }).isRequired,
      quote: PropTypes.shape({
        symbol: PropTypes.string.isRequired
      }).isRequired,
      avatarProps: PropTypes.shape({
        small: PropTypes.bool,
        medium: PropTypes.bool,
        large: PropTypes.bool,
        xlarge: PropTypes.bool
      }),
      rowStyle: PropTypes.object,
      priceStyle: PropTypes.object
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
    const { avatarProps, base, quote, rowStyle, priceStyle } = this.props;
    // TODO: Replace OrderbookPrice
    return (
      <Row style={[style.container, rowStyle]}>
        <TokenIcon
          symbol={base.symbol}
          showName={false}
          showSymbol={false}
          {...avatarProps}
        />
        <HorizontalPadding size={10} />
        {/**/}
        <HorizontalPadding size={3} />
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
  },
  avatarWrapper: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: 5
  }
};

export default connect(
  state => ({}),
  dispatch => ({ dispatch })
)(LogoTicker);
