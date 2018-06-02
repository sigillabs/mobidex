import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { getProfitLossStyle } from '../../styles';
import {
  detailsFromTicker,
  formatMoney,
  formatPercent,
  getImage
} from '../../utils';
import MutedText from '../components/MutedText';
import Row from '../components/Row';

class LogoTicker extends Component {
  static propTypes = {
    avatarProps: PropTypes.shape({
      small: PropTypes.bool,
      medium: PropTypes.bool,
      large: PropTypes.bool,
      xlarge: PropTypes.bool
    })
  };

  static defaultProps = {
    avatarProps: {
      medium: true,
      rounded: true,
      activeOpacity: 0.7,
      overlayContainerStyle: { backgroundColor: 'transparent' }
    }
  };

  render() {
    const {
      avatarProps,
      forexCurrency,
      token: { decimals, symbol },
      ...more
    } = this.props;
    const proceed =
      this.props.ticker.forex[symbol] &&
      this.props.ticker.forex[symbol][forexCurrency];

    if (!proceed) return null;

    const forexTicker = this.props.ticker.forex[symbol][forexCurrency];
    const { changePercent } = detailsFromTicker(forexTicker);

    const { rowStyle, priceStyle, priceChangeStyle } = more;

    return (
      <Row style={rowStyle}>
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginHorizontal: 5
            }
          ]}
        >
          <Avatar source={getImage(symbol)} {...avatarProps || {}} />
        </View>
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginHorizontal: 5
            }
          ]}
        >
          {forexTicker ? (
            <Text style={[{ fontSize: 24 }, priceStyle]}>
              {formatMoney(forexTicker.price)}
            </Text>
          ) : null}
          {changePercent ? (
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

export default connect(
  state => ({
    ...state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(LogoTicker);
