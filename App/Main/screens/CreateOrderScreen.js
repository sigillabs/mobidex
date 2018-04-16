import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Card, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import BigNumber from 'bignumber.js';
import { ZeroEx } from '0x.js';
import { createSignSubmitOrder, gotoOrders } from '../../../thunks';
import Button from '../../components/Button';
import LongButton from '../../components/LongButton';
import ButtonGroup from '../../components/ButtonGroup';
import NormalHeader from '../headers/Normal';

const SIDES = ['bid', 'ask'];
const TITLES = ['Create Buy Order', 'Create Sell Order'];

class CreateOrderScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <NormalHeader navigation={navigation} />
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      side: 0,
      amount: new BigNumber(0),
      amountError: false,
      price: new BigNumber(0),
      priceError: false
    };
  }

  onSetAmount = value => {
    try {
      let amount = new BigNumber(value);
      if (amount.gt(0)) {
        this.setState({ amount: amount, amountError: false });
      } else {
        this.setState({ amount: new BigNumber(0), amountError: true });
      }
    } catch (err) {
      this.setState({ amount: new BigNumber(0), amountError: true });
    }
  };

  onSetPrice = value => {
    try {
      let price = new BigNumber(value);
      if (price.gt(0)) {
        this.setState({ price: price, priceError: false });
      } else {
        this.setState({ price: new BigNumber(0), priceError: true });
      }
    } catch (err) {
      this.setState({ price: new BigNumber(0), priceError: true });
    }
  };

  submit = async () => {
    let { quoteToken, baseToken } = this.props;
    let { side, price, amount } = this.state;
    let makerAmount, makerToken, takerAmount, takerToken;

    let result = await this.props.dispatch(
      createSignSubmitOrder(SIDES[side], price, amount)
    );

    if (result) {
      this.props.navigation.push('Trading');
    }
  };

  render() {
    return (
      <ScrollView>
        <Card title={TITLES[this.state.side]}>
          <ButtonGroup
            onPress={index => {
              this.setState({ side: index });
            }}
            selectedIndex={this.state.side}
            buttons={SIDES}
            containerBorderRadius={0}
            containerStyle={styles.container}
            buttonStyle={styles.button}
          />
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <Input
              placeholder="Price"
              displayError={this.state.priceError}
              onChangeText={this.onSetPrice}
              keyboardType="numeric"
              errorMessage={'Price should be numeric and greater than `0`.'}
              errorStyle={{ color: 'red' }}
              icon={<Icon name="money" size={24} color="black" />}
              containerStyle={{ width: '100%', marginBottom: 10 }}
            />
            <Input
              placeholder="Amount"
              displayError={this.state.amountError}
              onChangeText={this.onSetAmount}
              keyboardType="numeric"
              errorMessage={'Amounts should be numeric and greater than `0`.'}
              errorStyle={{ color: 'red' }}
              icon={<Icon name="money" size={24} color="black" />}
              containerStyle={{ width: '100%', marginBottom: 10 }}
            />
          </View>
          <View style={{ height: 30 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row'
              }}
            >
              <Text>Sub Total</Text>
              <Text>: </Text>
              <Text>
                {this.state.price.mul(this.state.amount).toFixed(6, 1)}
              </Text>
            </View>
          </View>
          <View style={{ marginBottom: 10 }} />
          <Button
            large
            onPress={this.submit}
            icon={<Icon name="check" size={24} color="white" />}
            title="Submit Order"
          />
        </Card>
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    borderRadius: 0,
    borderWidth: 0,
    height: 40,
    padding: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10
  }
};

export default connect(
  (state, ownProps) => ({
    ...state.device,
    ...state.settings,
    ...state.wallet,
    ...ownProps
  }),
  dispatch => ({ dispatch })
)(CreateOrderScreen);
