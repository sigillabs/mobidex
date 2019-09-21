import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {View} from 'react-native';
import {Avatar, Text} from 'react-native-elements';
import * as AssetService from '../../services/AssetService';
import {fonts, images, styles} from '../../styles';
import {addressProp} from '../../types/props';
import AddressText from './AddressText';
import Row from './Row';

export default class UserIcon extends Component {
  static get propTypes() {
    return {
      address: addressProp.isRequired,
      avatarProps: PropTypes.object,
      containerStyle: PropTypes.object,
      labelProps: PropTypes.object,
    };
  }

  render() {
    const {
      address,
      avatarProps,
      containerStyle,
      labelProps,
      ...rest
    } = this.props;

    return (
      <View style={[styles.center, containerStyle]}>
        <Avatar
          rounded
          icon={{name: 'user', type: 'font-awesome'}}
          size={50}
          containerStyle={styles.mb1}
          {...avatarProps}
        />

        <Row>
          <AddressText
            address={address}
            style={[fonts.small, styles.textCenter]}
            summarize={true}
            {...labelProps}
          />
        </Row>
      </View>
    );
  }
}
