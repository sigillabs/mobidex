import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { fonts, styles } from '../../styles';
import { getImage } from '../../utils';

export default class TokenIcon extends Component {
  render() {
    const {
      token: { name, symbol },
      amount,
      style,
      showName,
      showSymbol
    } = this.props;

    return (
      <View style={[styles.center, style]}>
        <Avatar
          rounded
          source={getImage(symbol)}
          containerStyle={[showName || showSymbol ? styles.mb1 : null]}
          overlayContainerStyle={styles.background}
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
  token: PropTypes.shape({
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired
  }).isRequired,
  amount: PropTypes.number,
  style: PropTypes.object,
  showName: PropTypes.bool,
  showSymbol: PropTypes.bool
};

TokenIcon.defaultProps = {
  showName: true,
  showSymbol: true
};
