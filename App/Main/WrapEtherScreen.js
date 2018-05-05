import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import BigNumber from 'bignumber.js';
import { ZeroEx } from '0x.js';
import { wrapEther } from '../../thunks';
import GlobalStyles from '../../styles';
import Button from '../components/Button';

class WrapEtherScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: new BigNumber(0),
      amountError: false
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

  submit = async () => {
    let { amount } = this.state;
    await this.props.dispatch(wrapEther(amount));
    this.props.navigation.push('Portfolio');
  };

  render() {
    return (
      <Card title={'Wrap Ether'}>
        <View style={{ marginBottom: 10 }}>
          <Input
            placeholder="Amount"
            onChangeText={this.onSetAmount}
            keyboardType="numeric"
            errorMessage={
              this.state.amountError
                ? 'Amount should be numeric and greater than `0`.'
                : null
            }
            errorStyle={{ color: 'red' }}
            icon={<Icon name="money" size={24} color="black" />}
            containerStyle={{ width: '100%', marginBottom: 10 }}
          />
        </View>
        <Button
          large
          onPress={this.submit}
          icon={<Icon name="check" size={24} color="white" />}
          title={'Wrap'}
          style={{ width: '100%' }}
        />
      </Card>
    );
  }
}

export default connect(state => ({}), dispatch => ({ dispatch }))(
  WrapEtherScreen
);
