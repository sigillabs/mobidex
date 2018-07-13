import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import * as DeviceInfo from 'react-native-device-info';
import { ListItem, Text } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import * as styles from '../styles';
import Button from './components/Button';
import MutedText from './components/MutedText';
import NormalHeader from './headers/Normal';
import NavigationService from './services/NavigationService';
import * as WalletService from './services/WalletService';

class SettingsScreen extends Component {
  render() {
    const { network, relayerEndpoint, forexCurrency, quoteSymbol } = this.props;
    return (
      <View style={{ width: '100%' }}>
        <NormalHeader
          navigation={this.props.navigation}
          title="Settings"
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
            subtitle={<Text>{network}</Text>}
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
        </ScrollView>
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <Button
            title="Lock"
            buttonStyle={{ width: 100 }}
            icon={<FontAwesome name="lock" size={20} color="white" />}
            onPress={() => {
              WalletService.lock();
              NavigationService.navigate('Locked');
            }}
          />
        </View>
      </View>
    );
  }
}

SettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  network: PropTypes.string.isRequired,
  relayerEndpoint: PropTypes.string.isRequired,
  forexCurrency: PropTypes.string.isRequired,
  quoteSymbol: PropTypes.string.isRequired
};

export default connect(
  state => ({ ...state.settings }),
  dispatch => ({ dispatch })
)(SettingsScreen);
