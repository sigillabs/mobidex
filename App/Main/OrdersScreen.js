import * as _ from 'lodash';
import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import {
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native';
import { Avatar, List, ListItem, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { loadOrders } from '../../thunks';
import {
  formatAmountWithDecimals,
  getImage,
  getTokenByAddress,
  prices
} from '../../utils';
import Row from '../components/Row';
import MutedText from '../components/MutedText';

const TokenOrder = connect(
  state => ({
    ...state.relayer,
    ...state.wallet
  }),
  dispatch => ({ dispatch })
)(
  class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        makerToken: null,
        takerToken: null,
        ready: false
      };
    }

    async componentDidMount() {
      let [makerToken, takerToken] = await Promise.all([
        getTokenByAddress(this.props.web3, this.props.order.makerTokenAddress),
        getTokenByAddress(this.props.web3, this.props.order.takerTokenAddress)
      ]);

      this.setState({
        makerToken,
        takerToken,
        ready: true
      });
    }

    render() {
      if (!this.state.ready) return null;

      const { makerToken, takerToken } = this.state;
      const { order } = this.props;
      const left = formatAmountWithDecimals(
        order.makerTokenAmount,
        makerToken.decimals || 18
      );
      const right = formatAmountWithDecimals(
        order.takerTokenAmount,
        takerToken.decimals || 18
      );

      return (
        <ListItem
          roundAvatar
          bottomDivider
          title={
            <View style={styles.itemContainer}>
              <Row>
                <Text style={([styles.left, styles.large], { flex: 1 })}>
                  {left} {makerToken.symbol}
                </Text>
                <Icon name="swap" color="black" size={24} />
                <Text
                  style={[
                    styles.right,
                    styles.large,
                    styles.padLeft,
                    { flex: 1 }
                  ]}
                >
                  {right} {takerToken.symbol}
                </Text>
              </Row>
            </View>
          }
          subtitle={
            <View style={styles.itemContainer}>
              <Row>
                <MutedText style={[styles.left]}>Maker</MutedText>
                <MutedText style={[styles.right, styles.padLeft]}>
                  Taker
                </MutedText>
              </Row>
            </View>
          }
          hideChevron={true}
        />
      );
    }
  }
);

class OrdersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: true,
      showForexPrices: false
    };
  }

  async componentDidMount() {
    await this.onRefresh();
  }

  render() {
    const orders = this.filterOrders();

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        <View style={{ width: '100%', backgroundColor: 'white' }}>
          {orders.map((order, index) => {
            return (
              <TouchableOpacity key={`order-${index}`}>
                <TokenOrder order={order} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  filterOrders() {
    const { params } = this.props.navigation.state;
    let orders = this.props.orders.filter(o => o.maker === this.props.address);
    if (params && params.token) {
      orders = orders.filter(
        o => o.maker_token_address === this.props.navigation.state.params.token
      );
    }
    return orders;
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadOrders());
    this.setState({ refreshing: false });
  };
}

const styles = {
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: '100%'
  },
  center: {
    textAlign: 'center'
  },
  padBottom: {
    marginBottom: 5
  },
  padLeft: {
    marginLeft: 10
  },
  small: {
    fontSize: 10
  },
  large: {
    fontSize: 14
  },
  profit: {
    color: 'green'
  },
  loss: {
    color: 'red'
  },
  left: {
    whiteSpace: 'nowrap'
  },
  right: {
    flex: 1,
    textAlign: 'right',
    marginHorizontal: 10,
    whiteSpace: 'nowrap'
  }
};

export default connect(
  state => ({
    ...state.relayer,
    ...state.wallet
  }),
  dispatch => ({ dispatch })
)(OrdersScreen);
