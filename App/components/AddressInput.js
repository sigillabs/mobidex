import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Divider, Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';

export default class AddressInput extends Component {
  render() {
    const { onChange, containerStyle, wrapperStyle, ...rest } = this.props;
    return (
      <View style={[containerStyle]}>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            },
            wrapperStyle
          ]}
        >
          <Icon name="user" size={24} color="black" style={{ marginLeft: 5 }} />
          <Text style={{ marginLeft: 10, marginRight: 10 }}>0x</Text>
          <Input
            placeholder="Address"
            onChangeText={onChange}
            keyboardType="ascii-capable"
            inputStyle={{ marginLeft: 0 }}
            inputContainerStyle={{ borderBottomWidth: 0, padding: 0 }}
            containerStyle={{ flex: 1, marginBottom: 0, marginLeft: 0 }}
            {...rest}
          />
        </View>
        <Divider />
      </View>
    );
  }
}

AddressInput.propTypes = {
  avatarProps: PropTypes.shape({
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
    xlarge: PropTypes.bool
  }),
  onChange: PropTypes.func,
  containerStyle: PropTypes.object,
  wrapperStyle: PropTypes.object
};

AddressInput.defaultProps = {
  avatarProps: {
    medium: true,
    rounded: true,
    activeOpacity: 0.7,
    overlayContainerStyle: { backgroundColor: 'transparent' }
  }
};
