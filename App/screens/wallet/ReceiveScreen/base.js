import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Clipboard, Share, TouchableOpacity, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import ethUtil from 'ethereumjs-util';
import { styles } from '../../../../styles';
import Button from '../../../components/Button';

class BaseReceiveScreen extends Component {
  render() {
    let uri = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${ethUtil.stripHexPrefix(
      this.props.address
    )}`;

    return (
      <View
        style={[
          {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }
        ]}
      >
        <Avatar size="xlarge" source={{ uri }} />
        <Text h4>Address</Text>
        <TouchableOpacity onPress={() => this.copy()} style={styles.row}>
          <Text style={{ fontSize: 13, marginRight: 5 }}>
            {`0x${ethUtil.stripHexPrefix(this.props.address.toString())}`}
          </Text>
          <MaterialIcons name="content-copy" size={20} />
        </TouchableOpacity>
        <Button
          large
          icon={<MaterialIcons name="send" size={20} color="white" />}
          onPress={() => this.share()}
          title="Share Address"
          style={{ marginTop: 10 }}
        />
      </View>
    );
  }

  copy() {
    Clipboard.setString(
      `0x${ethUtil.stripHexPrefix(this.props.address.toString())}`
    );
  }

  share() {
    Share.share(
      {
        message: `Here's My Address: 0x${ethUtil.stripHexPrefix(
          this.props.address.toString()
        )}`,
        title: 'My Address'
      },
      {
        // Android only:
        dialogTitle: 'Mobidex Address',
        // iOS only:
        subject: 'Mobidex Address',
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter']
      }
    );
  }
}

BaseReceiveScreen.propTypes = {
  address: PropTypes.string
};

export default connect(
  state => ({ ...state.device.layout, ...state.wallet }),
  dispatch => ({ dispatch })
)(BaseReceiveScreen);
