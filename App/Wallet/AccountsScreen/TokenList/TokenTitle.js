import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { colors, styles } from '../../../../styles';
import TokenLockByAssetData from '../../../views/TokenLockByAssetData';

export default class TokenTitle extends Component {
  render() {
    const { asset } = this.props;

    return (
      <Text
        style={[
          {
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            textAlign: 'left'
          }
        ]}
      >
        <TokenLockByAssetData
          assetData={asset.assetData}
          color={this.props.highlight ? colors.white : colors.yellow0}
        />
        <Text> </Text>
        <Text> </Text>
        <Text>{asset.name}</Text>
      </Text>
    );
  }
}

TokenTitle.propTypes = {
  asset: PropTypes.object.isRequired,
  highlight: PropTypes.bool.isRequired
};
