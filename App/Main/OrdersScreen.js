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
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { loadOrders, cancelOrder } from '../../thunks';
import {
  formatAmountWithDecimals,
  getImage,
  getTokenByAddress,
  prices
} from '../../utils';
import MutedText from '../components/MutedText';
import Row from '../components/Row';

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
              <Swipeout
                autoClose={true}
                style={{
                  backgroundColor: 'transparent'
                }}
                right={[
                  {
                    // component: (
                    //   <Button
                    //     large
                    //     icon={<Icon name="trash" size={20} color="white" />}
                    //     onPress={this.delete}
                    //     title="Delete"
                    //     style={{ marginTop: 10 }}
                    //   />
                    // )
                    backgroundColor: colors.yellow0,
                    text: 'Delete',
                    type: 'delete',
                    underlayColor: colors.yellow0,
                    onPress: () => this.cancelOrder(order)
                  }
                ]}
              >
                <TokenOrder order={order} />
              </Swipeout>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  filterOrders() {
    const { params } = this.props.navigation.state;
    let orders = this.props.orders
      .filter(o => o.maker === this.props.address)
      .filter(o => o.status === 0);
    if (params && params.token) {
      orders = orders.filter(
        o => o.maker_token_address === this.props.navigation.state.params.token
      );
    }
    return orders;
  }

  async cancelOrder(order) {
    await this.props.dispatch(cancelOrder(order));
    await this.onRefresh();
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
  right: {
    flex: 1,
    textAlign: 'right',
    marginHorizontal: 10
  }
};

export default connect(
  state => ({
    ...state.relayer,
    ...state.wallet
  }),
  dispatch => ({ dispatch })
)(OrdersScreen);
