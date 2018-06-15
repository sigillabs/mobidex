import { ZeroEx } from '0x.js';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { colors } from '../../../styles';
import { findTickerDetails, formatAmount, formatMoney } from '../../../utils';
import TokenIcon from '../../components/TokenIcon';
import TwoColumnListItem from '../../components/TwoColumnListItem';

class BaseTokenItem extends Component {
  render() {
    const { token, ticker, settings } = this.props;
    const { decimals, symbol } = token;
    const { forexCurrency } = settings;
    const balance = ZeroEx.toUnitAmount(token.balance, decimals);
    const forex = findTickerDetails(ticker.forex, symbol, forexCurrency);

    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
      >
        <Text>
          {formatAmount(balance)} {symbol}
        </Text>
        {forex && forex.price ? (
          <Text>({formatMoney(balance.mul(forex.price).toNumber())})</Text>
        ) : null}
      </View>
    );
  }
}

BaseTokenItem.propTypes = {
  token: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

const TokenItem = connect(
  state => ({
    settings: state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(BaseTokenItem);

class TokenList extends Component {
  render() {
    const { tokens } = this.props;

    return (
      <View style={{ width: '100%' }}>
        {tokens.map((token, index) => (
          <TouchableOpacity
            key={`token-${index}`}
            onPress={() => this.props.onPress(token)}
          >
            <TwoColumnListItem
              roundAvatar
              bottomDivider
              leftElement={
                <TokenIcon
                  token={token}
                  style={{ flex: 0 }}
                  numberOfLines={1}
                  showSymbol={false}
                  showName={false}
                />
              }
              left={token.name}
              right={<TokenItem token={token} />}
              containerStyle={[
                this.props.token &&
                  this.props.token.address === token.address &&
                  styles.highlight
              ]}
              rightStyle={{ textAlign: 'right' }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

TokenList.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.object).isRequired,
  token: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
};

export default connect(
  state => ({
    ...state.settings
  }),
  dispatch => ({ dispatch })
)(TokenList);

const styles = {
  highlight: {
    backgroundColor: colors.yellow0,
    borderColor: colors.yellow0,
    color: colors.white,
    borderWidth: 1
  }
};
