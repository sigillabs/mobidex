import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import * as AssetService from '../../services/AssetService';
import { fonts, images, styles } from '../../styles';
import { getImage } from '../../utils';

export default class TokenIcon extends Component {
  render() {
    const { symbol, amount, style, showName, showSymbol, ...rest } = this.props;
    const { name } = AssetService.findAssetBySymbol(symbol);

    return (
      <View style={[styles.center, style]}>
        <Avatar
          rounded
          source={getImage(symbol)}
          containerStyle={[showName || showSymbol ? styles.mb1 : null]}
          avatarStyle={[images.fixAndroid]}
          {...rest}
        />
        {showName ? (
          <Text style={[fonts.small, styles.textCenter]}>{name}</Text>
        ) : null}
        {showSymbol ? (
          <Text style={[fonts.small, styles.textCenter]}>
            {amount} {symbol}
          </Text>
        ) : null}
      </View>
    );
  }
}

TokenIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  amount: PropTypes.number,
  style: PropTypes.object,
  showName: PropTypes.bool,
  showSymbol: PropTypes.bool
};

TokenIcon.defaultProps = {
  showName: true,
  showSymbol: true
};
