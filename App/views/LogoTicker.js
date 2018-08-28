import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { getProfitLossStyle } from '../../styles';
import {
  formatAmount,
  formatMoney,
  formatPercent,
  getImage
} from '../../utils';
import MutedText from '../components/MutedText';
import SmallText from '../components/SmallText';
import Row from '../components/Row';
import * as TickerService from '../../services/TickerService';

class LogoTicker extends Component {
  render() {
    const {
      showChangePercent,
      avatarProps,
      settings: { showForexPrices },
      token: { symbol },
      ...more
    } = this.props;
    const ticker = showForexPrices
      ? TickerService.getForexTicker(symbol)
      : TickerService.getQuoteTicker(symbol);

    if (!ticker) return null;

    const changePercent = TickerService.get24HRChangePercent(ticker);
    const { rowStyle, priceStyle, priceChangeStyle } = more;

    return (
      <Row style={[style.container, rowStyle]}>
        <View style={[]}>
          <Avatar source={getImage(symbol)} {...avatarProps || {}} />
        </View>
        <View style={style.avatarWrapper}>
          <Text style={[{ fontSize: 24 }, priceStyle]}>
            {showForexPrices
              ? formatMoney(ticker.price)
              : formatAmount(ticker.price)}
            {!showForexPrices ? <SmallText>/{symbol}</SmallText> : null}
          </Text>
          {showChangePercent ? (
            <MutedText
              style={[
                { fontSize: 14 },
                getProfitLossStyle(changePercent),
                priceChangeStyle
              ]}
            >
              {formatPercent(changePercent)}
            </MutedText>
          ) : null}
        </View>
      </Row>
    );
  }
}

LogoTicker.propTypes = {
  settings: PropTypes.object.isRequired,
  token: PropTypes.shape({
    symbol: PropTypes.string.isRequired
  }).isRequired,
  avatarProps: PropTypes.shape({
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
    xlarge: PropTypes.bool
  }),
  showChangePercent: PropTypes.bool
};

LogoTicker.defaultProps = {
  avatarProps: {
    medium: true,
    rounded: true,
    activeOpacity: 0.7,
    overlayContainerStyle: { backgroundColor: 'transparent' }
  },
  showChangePercent: true
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
    settings: state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(LogoTicker);
