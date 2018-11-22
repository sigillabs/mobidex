import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../../../../styles';
import { assetProp } from '../../../../types/props';
import { loadAllowances, loadBalances } from '../../../../thunks';
import EmptyList from '../../../components/EmptyList';
import MutedText from '../../../components/MutedText';
import TokenIcon from '../../../components/TokenIcon';
import TwoColumnListItem from '../../../components/TwoColumnListItem';
import TokenItem from './TokenItem';
import TokenTitle from './TokenTitle';

class TokenList extends Component {
  static get propTypes() {
    return {
      asset: assetProp,
      assets: PropTypes.arrayOf(PropTypes.object).isRequired,
      onPress: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  render() {
    const { assets } = this.props;

    return (
      <FlatList
        data={assets}
        keyExtractor={(item, index) => `asset-${index}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={`asset-${index}`}
            onPress={() => this.props.onPress(item)}
          >
            <TwoColumnListItem
              roundAvatar
              bottomDivider
              leftElement={
                <TokenIcon
                  token={item}
                  style={{ flex: 0 }}
                  numberOfLines={1}
                  showSymbol={false}
                  showName={false}
                />
              }
              left={
                <TokenTitle
                  asset={item}
                  highlight={this.props.asset.address === item.address}
                />
              }
              right={
                <TokenItem
                  asset={item}
                  highlight={this.props.asset.address === item.address}
                />
              }
              containerStyle={[
                this.props.asset && this.props.asset.address === item.address
                  ? styles.highlight
                  : null
              ]}
              rightStyle={{ textAlign: 'right' }}
            />
          </TouchableOpacity>
        )}
        refreshing={this.state.refreshing}
        onRefresh={() => this.onRefresh()}
        ListEmptyComponent={() => (
          <EmptyList
            wrapperStyle={{
              height: '100%',
              width: '100%',
              justifyContent: 'flex-start'
            }}
          >
            <MutedText style={{ marginTop: 25 }}>Loading Assets</MutedText>
          </EmptyList>
        )}
      />
    );
  }

  async onRefresh(reload = true) {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadAllowances(reload));
    await this.props.dispatch(loadBalances(reload));
    this.setState({ refreshing: false });
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(TokenList);

const styles = {
  highlight: {
    backgroundColor: colors.yellow0,
    borderColor: colors.yellow0,
    borderWidth: 1
  }
};
