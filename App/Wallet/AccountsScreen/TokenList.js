import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../../styles';
import { formatMoney } from '../../../utils';
import TokenIcon from '../../components/TokenIcon';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import FormattedAdjustedTokenBalance from '../../components/FormattedAdjustedTokenBalance';
import * as TickerService from '../../services/TickerService';
import * as WalletService from '../../services/WalletService';

class TokenItem extends Component {
  render() {
    const { token } = this.props;
    const { symbol } = token;
    const balance = WalletService.getAdjustedBalanceBySymbol(symbol);
    const price = TickerService.getCurrentPrice(
      TickerService.getForexTicker(symbol)
    );

    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
      >
        <FormattedAdjustedTokenBalance symbol={symbol} />
        <Text>({formatMoney(balance.mul(price).toNumber())})</Text>
      </View>
    );
  }
}

TokenItem.propTypes = {
  token: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default class TokenList extends Component {
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
  token: PropTypes.object,
  onPress: PropTypes.func.isRequired
};

const styles = {
  highlight: {
    backgroundColor: colors.yellow0,
    borderColor: colors.yellow0,
    color: colors.white,
    borderWidth: 1
  }
};
