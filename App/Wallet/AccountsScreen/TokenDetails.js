import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { gotoSendScreen, gotoReceiveScreen } from '../../../thunks';
import { getImage } from '../../../utils';
import Button from '../../components/Button';
import FormattedAdjustedTokenBalance from '../../components/FormattedAdjustedTokenBalance';

class TokenDetails extends Component {
  receive() {
    this.props.dispatch(gotoReceiveScreen(this.props.token));
  }

  send() {
    this.props.dispatch(gotoSendScreen(this.props.token));
  }

  render() {
    const { token } = this.props;
    const { symbol } = token;

    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        <Avatar
          size="large"
          rounded
          source={getImage(token.symbol)}
          activeOpacity={0.7}
        />
        <FormattedAdjustedTokenBalance
          symbol={symbol}
          style={{ marginTop: 5 }}
        />

        <View
          style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <Button
            large
            title="Receive"
            icon={
              <MaterialCommunityIcons name="qrcode" color="white" size={18} />
            }
            onPress={() => this.receive()}
          />
          <View style={{ width: 10 }} />
          <Button
            large
            title="Send"
            icon={<MaterialIcons name="send" color="white" size={18} />}
            iconRight={true}
            onPress={() => this.send()}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  state => ({
    ...state.wallet
  }),
  dispatch => ({ dispatch })
)(TokenDetails);
