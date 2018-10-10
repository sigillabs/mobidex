import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import * as DeviceInfo from 'react-native-device-info';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import NavigationService from '../services/NavigationService';
import MutedText from './components/MutedText';
import NormalHeader from './headers/Normal';

class SettingsScreen extends Component {
  render() {
    const { network, relayerEndpoint, forexCurrency, quoteSymbol } = this.props;
    return (
      <View style={{ width: '100%' }}>
        <NormalHeader
          navigation={this.props.navigation}
          title="About"
          showBackButton={false}
          showForexToggleButton={false}
        />
        <ScrollView>
          <ListItem
            title={<MutedText>Forex Currency</MutedText>}
            subtitle={<Text>{forexCurrency}</Text>}
          />
          <ListItem
            title={<MutedText>Quote Token</MutedText>}
            subtitle={<Text>{quoteSymbol}</Text>}
          />
          <ListItem
            title={<MutedText>Network</MutedText>}
            subtitle={<Text>{network === 1 ? 'mainnet' : 'testnet'}</Text>}
          />
          <ListItem
            title={<MutedText>Relayer Endpoint</MutedText>}
            subtitle={<Text>{relayerEndpoint}</Text>}
          />
          <ListItem
            title={<MutedText>Version</MutedText>}
            subtitle={
              <Text>
                {DeviceInfo.getSystemName()} {DeviceInfo.getVersion()}.{DeviceInfo.getBuildNumber()}
              </Text>
            }
          />
          <ListItem
            title={<MutedText>Compliance</MutedText>}
            subtitle={
              <TouchableOpacity
                onPress={() => {
                  NavigationService.navigate('WyreVerification');
                }}
              >
                <Text>Click here</Text>
              </TouchableOpacity>
            }
          />
        </ScrollView>
      </View>
    );
  }
}

SettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  network: PropTypes.number.isRequired,
  relayerEndpoint: PropTypes.string.isRequired,
  forexCurrency: PropTypes.string.isRequired,
  quoteSymbol: PropTypes.string.isRequired
};

export default connect(
  state => ({ ...state.settings }),
  dispatch => ({ dispatch })
)(SettingsScreen);
