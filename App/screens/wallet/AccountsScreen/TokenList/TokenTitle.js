import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';
import TokenLockByAssetData from '../../../../views/TokenLockByAssetData';
import Text from '../../../../components/Text';

export default class TokenTitle extends Component {
  static get propTypes() {
    return {
      asset: PropTypes.object.isRequired,
      highlight: PropTypes.bool.isRequired
    };
  }

  render() {
    const { asset } = this.props;

    return (
      <Text style={[styles.container]}>
        <TokenLockByAssetData
          assetData={asset.assetData}
          color={this.props.highlight ? colors.white : colors.yellow0}
        />
        <Text>
          {'\u2066'} {asset.name}
        </Text>
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    textAlign: 'left'
  }
});
