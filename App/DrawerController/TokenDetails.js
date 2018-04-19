import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Button from '../components/Button';
import { closeDrawer } from '../../actions';
import {
  formatAmountWithDecimals,
  summarizeAddress,
  getImage
} from '../../utils';

class TokenDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddress: false
    };
  }

  receive = () => {
    this.props.dispatch(closeDrawer());
    this.props.dispatch(NavigationActions.push({ routeName: 'Receive' }));
  };

  send = () => {
    this.props.dispatch(closeDrawer());
    this.props.dispatch(
      NavigationActions.push({
        routeName: 'Send',
        params: {
          token: this.props.token
        }
      })
    );
  };

  toggleShowAddress = () => {
    this.setState({ showAddress: !this.state.showAddress });
  };

  render() {
    let { token, address } = this.props;
    let { balance, decimals } = token;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'stretch'
        }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Avatar
            large
            rounded
            width={34}
            height={34}
            source={getImage(token.symbol)}
            activeOpacity={0.7}
            onPress={this.toggleShowAddress}
          />
          <Text style={{ marginTop: 10, marginBottom: 10 }}>
            {formatAmountWithDecimals(balance, decimals)}
          </Text>
          <Text onPress={this.toggleShowAddress}>
            {this.state.showAddress ? address : summarizeAddress(address)}
          </Text>
        </View>

        <View
          style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button
            large
            title="Receive"
            icon={<Icon name="move-to-inbox" color="white" size={18} />}
            buttonStyle={{ borderRadius: 0 }}
            onPress={this.receive}
          />
          <View style={{ width: 10 }} />
          <Button
            large
            title="Send"
            icon={<Icon name="send" color="white" size={18} />}
            buttonStyle={{ borderRadius: 0 }}
            onPress={this.send}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  state => ({
    ...state.wallet,
    navigation: state.navigation
  }),
  dispatch => ({ dispatch })
)(TokenDetails);
