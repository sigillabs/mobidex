import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { lock, loadAssets, loadForexPrices } from '../../../thunks';
import TimedUpdater from '../../components/TimedUpdater';
import NormalHeader from '../headers/Normal';
import TokenList from '../../views/TokenList';
import TokenDetails from '../../views/TokenDetails';

class PortfolioScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      refreshing: false
    };
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadAssets(true));
    this.setState({ refreshing: false });
  };

  async componentDidMount() {
    this.props.dispatch(loadAssets());
  }

  render() {
    let ethToken = _.find(this.props.assets, { symbol: 'ETH' });
    let filteredTokens = _.without(this.props.assets, ethToken);

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'stretch'
          }}
        >
          <TimedUpdater
            update={() => this.props.dispatch(loadForexPrices())}
            timeout={1000}
          />
          <View style={{ height: 200 }}>
            <TokenDetails
              address={this.props.address}
              token={this.state.token || ethToken}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TokenList
              token={this.state.token}
              tokens={filteredTokens}
              onPress={asset => {
                this.props.navigation.push('TokenDetails', { token: asset });
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default connect(
  state => ({ ...state.wallet, ...state.device.layout }),
  dispatch => ({ dispatch })
)(PortfolioScreen);
