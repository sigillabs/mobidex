import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '../../../../styles';
import TokenIcon from '../../../components/TokenIcon';
import TwoColumnListItem from '../../../components/TwoColumnListItem';
import TokenItem from './TokenItem';
import TokenTitle from './TokenTitle';

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
              left={
                <TokenTitle
                  asset={asset}
                  highlight={this.props.asset.address === asset.address}
                />
              }
              right={
                <TokenItem
                  asset={asset}
                  highlight={this.props.asset.address === asset.address}
                />
              }
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
