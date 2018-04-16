import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { lock, loadAssets, loadForexPrices } from '../../../thunks';
import TimedUpdater from '../../components/TimedUpdater';
import NormalHeader from '../headers/Normal';
import AssetList from '../../views/AssetList';
import AssetDetails from '../../views/AssetDetails';

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
    let ethAsset = _.find(this.props.assets, { symbol: 'ETH' });
    let filteredAssets = _.without(this.props.assets, ethAsset);

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
            <AssetDetails
              address={this.props.address}
              asset={this.state.token || ethAsset}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AssetList
              asset={this.state.token}
              assets={filteredAssets}
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
