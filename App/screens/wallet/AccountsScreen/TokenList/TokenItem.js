import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import ForexBalanceByAssetData from '../../../../views/ForexBalanceByAssetData';
import TokenBalanceByAssetData from '../../../../views/TokenBalanceByAssetData';

export default class TokenItem extends Component {
  render() {
    const { asset } = this.props;

    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
      >
        <TokenBalanceByAssetData assetData={asset.assetData} />
        <Text>
          (<ForexBalanceByAssetData assetData={asset.assetData} />)
        </Text>
      </View>
    );
  }
}

TokenItem.propTypes = {
  asset: PropTypes.object.isRequired
};
