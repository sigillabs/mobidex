import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../../../styles';
import { formatMoney } from '../../../utils';
import TokenIcon from '../../components/TokenIcon';
import TwoColumnListItem from '../../components/TwoColumnListItem';
import FormattedAdjustedTokenBalance from '../../components/FormattedAdjustedTokenBalance';
import * as TickerService from '../../../services/TickerService';
import * as WalletService from '../../../services/WalletService';

class TokenItem extends Component {
  render() {
    const { asset } = this.props;
    const { symbol } = asset;
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
  asset: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default class TokenList extends Component {
  render() {
    const { assets } = this.props;

    return (
      <View style={{ width: '100%' }}>
        {assets.map((asset, index) => (
          <TouchableOpacity
            key={`asset-${index}`}
            onPress={() => this.props.onPress(asset)}
          >
            <TwoColumnListItem
              roundAvatar
              bottomDivider
              leftElement={
                <TokenIcon
                  token={asset}
                  style={{ flex: 0 }}
                  numberOfLines={1}
                  showSymbol={false}
                  showName={false}
                />
              }
              left={asset.name}
              right={<TokenItem asset={asset} />}
              containerStyle={[
                this.props.asset &&
                  this.props.asset.address === asset.address &&
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
  assets: PropTypes.arrayOf(PropTypes.object).isRequired,
  asset: PropTypes.object,
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
