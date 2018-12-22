import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Clipboard, Share, TouchableOpacity } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import ethUtil from 'ethereumjs-util';
import { connect as connectNavigation } from '../../../navigation';
import { styles } from '../../../styles';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';
import NotificationView from '../../views/NotificationView';

class BaseReceiveScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      address: PropTypes.string.isRequired
    };
  }

  render() {
    let uri = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${ethUtil.stripHexPrefix(
      this.props.address
    )}`;

    return (
      <NotificationView
        buttonProps={{
          title: 'Cancel'
        }}
        press={this.back}
        scrollViewContainerStyle={[styles.center, styles.h100]}
      >
        <Avatar size="xlarge" source={{ uri }} />
        <Text h4>Address</Text>
        <TouchableOpacity onPress={this.copy} style={styles.row}>
          <Text style={{ fontSize: 13, marginRight: 5 }}>
            {`0x${ethUtil.stripHexPrefix(this.props.address.toString())}`}
          </Text>
          <MaterialIcons name="content-copy" size={20} />
        </TouchableOpacity>
        <Button
          large
          icon={<MaterialIcons name="send" size={20} color="white" />}
          onPress={this.share}
          title="Share Address"
          style={{ marginTop: 10 }}
        />
      </NotificationView>
    );
  }

  back = () => this.props.navigation.dismissModal();

  copy = () =>
    Clipboard.setString(
      `0x${ethUtil.stripHexPrefix(this.props.address.toString())}`
    );

  share = () =>
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

export default connect(
  state => ({ ...state.device.layout, ...state.wallet }),
  dispatch => ({ dispatch })
)(connectNavigation(BaseReceiveScreen));
