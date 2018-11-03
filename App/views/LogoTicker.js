import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { formatProduct, getImage } from '../../utils';
import Row from '../components/Row';
import * as TickerService from '../../services/TickerService';
import OrderbookPrice from './OrderbookPrice';
import OrderbookForexPrice from './OrderbookForexPrice';

class LogoTicker extends Component {
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
        <View style={[]}>
          <Avatar source={getImage(base.symbol)} {...avatarProps || {}} />
        </View>
        <View style={style.avatarWrapper}>
          {showForexPrices ? (
            <OrderbookForexPrice
              style={[{ fontSize: 24 }, priceStyle]}
              product={formatProduct(base.symbol, quote.symbol)}
              default={0}
              side={'sell'}
            />
          ) : (
            <OrderbookPrice
              style={[{ fontSize: 24 }, priceStyle]}
              product={formatProduct(base.symbol, quote.symbol)}
              default={0}
              side={'sell'}
            />
          )}
        </View>
      </Row>
    );
  }
}

LogoTicker.propTypes = {
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

LogoTicker.defaultProps = {
  avatarProps: {
    medium: true,
    rounded: true,
    activeOpacity: 0.7,
    overlayContainerStyle: { backgroundColor: 'transparent' }
  }
};

const style = {
  container: {
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
