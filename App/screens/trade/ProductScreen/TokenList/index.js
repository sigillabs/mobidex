import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';
import {connect as connectNavigation} from '../../../../../navigation';
import {navigationProp, tokenProp} from '../../../../../types/props';
import EmptyList from '../../../../components/EmptyList';
import MutedText from '../../../../components/MutedText';
import TokenItem from './Item';

class BaseTokenList extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      tokens: PropTypes.arrayOf(tokenProp).isRequired,
    };
  }

  render() {
    const {tokens} = this.props;

    return (
      <FlatList
        data={tokens}
        keyExtractor={item => `token-${item.address}`}
        renderItem={({item}) => (
          <TokenItem
            tokenAddress={item.address}
            key={`token-${item.address}`}
            onPress={address =>
              this.props.navigation.push('navigation.trade.Details', {
                tokenAddress: address,
              })
            }
          />
        )}
        ListEmptyComponent={() => (
          <EmptyList
            wrapperStyle={{
              height: '100%',
              width: '100%',
              justifyContent: 'flex-start',
            }}>
            <MutedText style={{marginTop: 25}}>Loading Products</MutedText>
          </EmptyList>
        )}
      />
    );
  }
}

const TokenList = connectNavigation(BaseTokenList);

export default TokenList;
