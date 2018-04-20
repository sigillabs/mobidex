import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Card, Header, Icon, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { lock, loadAssets, loadForexPrices } from '../../thunks';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import LongButton from '../components/LongButton';
import Row from '../components/Row';
import TimedUpdater from '../components/TimedUpdater';
import PriceGraph from '../views/PriceGraph';
import TokenDetailsCard from '../views/TokenDetailsCard';

class TokenDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      refreshing: false
    };
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadAsset(true));
    this.setState({ refreshing: false });
  };

  async componentDidMount() {
    this.props.dispatch(loadAssets());
  }

  render() {
    let {
      navigation: {
        state: {
          params: {
            token: { address }
          }
        }
      }
    } = this.props;
    let token = _.find(this.props.assets, { address });

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
        <View>
          <TimedUpdater
            update={() => this.props.dispatch(loadForexPrices())}
            timeout={1000}
          />
          <Text h1 style={{ textAlign: 'center' }}>
            $21.27
          </Text>
          <PriceGraph height={200} containerStyle={{ margin: 15 }} />
          <Row style={{ margin: 15 }}>
            <Button
              large
              icon={<Icon name="send" size={20} color="white" />}
              onPress={() => this.props.navigation.push('CreateOrder')}
              title="Buy"
              containerStyle={{ width: '48%' }}
            />
            <Button
              large
              icon={<Icon name="send" size={20} color="white" />}
              onPress={this.sell}
              title="Sell"
              containerStyle={{ width: '48%' }}
            />
          </Row>
          <TokenDetailsCard volume={20} volatility={20} change={0.05} />
        </View>
      </ScrollView>
    );
  }
}

export default connect(
  state => ({ ...state.wallet, ...state.device.layout }),
  dispatch => ({ dispatch })
)(TokenDetailsScreen);
