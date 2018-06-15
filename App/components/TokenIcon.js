import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
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
      <View style={[styles.container, style]}>
        <Avatar
          rounded
          source={getImage(symbol)}
          containerStyle={[showName || showSymbol ? styles.padBottom : null]}
        />
        {showName ? (
          <Text style={[styles.small, styles.center]}>{name}</Text>
        ) : null}
        {showSymbol ? (
          <Text style={[styles.small, styles.center]}>
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

const styles = {
  container: { justifyContent: 'center', alignItems: 'center' },
  center: {
    textAlign: 'center'
  },
  padBottom: {
    marginBottom: 5
  },
  small: {
    fontSize: 10
  }
};
