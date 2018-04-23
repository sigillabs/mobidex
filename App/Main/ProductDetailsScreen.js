import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Card, Header, Icon, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { lock, loadAssets, loadForexPrices } from '../../thunks';
import { prices as fetchPrices } from '../../utils';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import LongButton from '../components/LongButton';
import Row from '../components/Row';
import TimedUpdater from '../components/TimedUpdater';
import PriceGraph from '../views/PriceGraph';
import TokenDetailsCard from '../views/TokenDetailsCard';

class ProductDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prices: [],
      refreshing: false
    };
  }

  async componentDidMount() {
    await this.props.dispatch(loadAssets());

    const token = this.getToken();
    const prices = await fetchPrices(token.symbol);
    this.setState({
      prices: prices.map(({ price, timestamp }) => ({
        price: parseFloat(price),
        timestamp
      }))
    });
  }

  render() {
    let token = this.getToken();

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
          <PriceGraph
            height={200}
            containerStyle={{ margin: 15 }}
            data={this.state.prices || []}
          />
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

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadAsset(true));
    this.setState({ refreshing: false });
  };

  getToken = () => {
    let {
      navigation: {
        state: {
          params: {
            product: { tokenA, tokenB }
          }
        }
      }
    } = this.props;
    return _.find(this.props.assets, { address: tokenA.address });
  };
}

export default connect(
  state => ({ ...state.wallet, ...state.device.layout }),
  dispatch => ({ dispatch })
)(ProductDetailsScreen);
