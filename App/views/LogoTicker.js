import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Avatar, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { fonts } from '../../styles';
import { formatProduct, formatSymbol, getImage } from '../../utils';
import HorizontalPadding from '../components/HorizontalPadding';
import Row from '../components/Row';
import * as TickerService from '../../services/TickerService';
import OrderbookPrice from './OrderbookPrice';
import OrderbookForexPrice from './OrderbookForexPrice';

class LogoTicker extends Component {
  static get propTypes() {
    return {
      showForexPrices: PropTypes.bool.isRequired,
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
    const {
      avatarProps,
      showForexPrices,
      base,
      quote,
      rowStyle,
      priceStyle
    } = this.props;
    const ticker = TickerService.getForexTicker(base.symbol);

    if (showForexPrices && !ticker) return null;

    return (
      <Row style={[style.container, rowStyle]}>
        <Avatar source={getImage(base.symbol)} {...avatarProps || {}} />
        <HorizontalPadding size={10} />
        {showForexPrices ? (
          <OrderbookForexPrice
            style={[fonts.xlarge, priceStyle]}
            product={formatProduct(base.symbol, quote.symbol)}
            default={0}
            side={'buy'}
          />
        ) : (
          <OrderbookPrice
            style={[fonts.xlarge, priceStyle]}
            product={formatProduct(base.symbol, quote.symbol)}
            default={0}
            side={'buy'}
          />
        )}
        {!showForexPrices ? (
          <React.Fragment>
            <HorizontalPadding size={3} />
            <Text style={[{ marginTop: 3 }]}>{formatSymbol(quote.symbol)}</Text>
          </React.Fragment>
        ) : null}
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
  state => ({
    ticker: state.ticker,
    showForexPrices: state.settings.showForexPrices
  }),
  dispatch => ({ dispatch })
)(LogoTicker);
