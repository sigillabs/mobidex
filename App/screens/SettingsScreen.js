import PropTypes from 'prop-types';
import * as _ from 'lodash';
import React from 'react';
import {
  Clipboard,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {setGasLevel, setGasStation} from '../../actions';
import {WalletService} from '../../services/WalletService';
import {showModal} from '../../navigation';
import {clearState} from '../../lib/stores/app';
import {colors, styles} from '../../styles';
import {clearCache} from '../../lib/utils';
import Divider from '../components/Divider';
import MutedText from '../components/MutedText';
import ReferralCodeInput from '../components/ReferralCodeInput';
import TouchableListItem from '../components/TouchableListItem';

const GAS_STATIONS = [
  {name: 'default', label: 'default'},
  {name: 'eth-gas-station-info', label: 'ethgasstation.info'},
  {name: 'ether-chain-gas-price-oracle', label: 'etherchain.info'},
];

const GAS_LEVELS = [
  {name: 'low', label: 'Slow  (< 30 min)'},
  {name: 'standard', label: 'Average (< 15 min)'},
  {name: 'high', label: 'Fast (< 2 min)'},
];

class SettingsScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          visible: false,
        },
        title: {
          text: 'Settings',
          alignment: 'center',
        },
      },
    };
  }

  static propTypes = {
    network: PropTypes.number.isRequired,
    forexCurrency: PropTypes.string.isRequired,
    quoteSymbol: PropTypes.string.isRequired,
    gasStation: PropTypes.string.isRequired,
    gasLevel: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const {
      network,
      forexCurrency,
      quoteSymbol,
      gasStation,
      gasLevel,
    } = this.props;

    return (
      <SafeAreaView style={[styles.h100, styles.w100]}>
        <ScrollView>
          <ListItem
            title={<MutedText>Forex Currency</MutedText>}
            subtitle={<Text>{forexCurrency}</Text>}
          />
          <ListItem
            title={<MutedText>Quote Token</MutedText>}
            subtitle={<Text>{quoteSymbol}</Text>}
          />
          <Divider style={[styles.p2, {backgroundColor: colors.grey6}]} />
          <ListItem
            title={<MutedText>Network</MutedText>}
            subtitle={<Text>{network}</Text>}
          />
          <TouchableListItem
            title="Gas Level"
            subtitle={<Text>{_.find(GAS_LEVELS, {name: gasLevel}).label}</Text>}
            onPress={this.showGasLevelSelect}
          />
          <TouchableListItem
            title="Gas Station"
            subtitle={
              <Text>{_.find(GAS_STATIONS, {name: gasStation}).label}</Text>
            }
            onPress={this.showGasStationSelect}
          />
          <Divider style={[styles.p2, {backgroundColor: colors.grey6}]} />
          <TouchableListItem
            title="Clear Cache"
            subtitle={<Text>Tap Here</Text>}
            onPress={this.clearCache}
          />
          {WalletService.instance.selected == 'bitski' ? (
            <TouchableListItem
              title="Sign Out Of Bitski"
              subtitle={<Text>Tap Here</Text>}
              onPress={this.removeWallet}
            />
          ) : (
            <TouchableListItem
              title="Remove Wallet (Dangerous)"
              subtitle={<Text>Tap Here</Text>}
              onPress={this.removeWallet}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  clearCache = () => {
    clearState();
    clearCache();
  };

  removeWallet = () => {
    clearState();
    clearCache();

    WalletService.instance.removeWallet();
  };

  showGasStationSelect = () => {
    showModal('modals.Select', {
      title: 'Select Gas Station',
      options: GAS_STATIONS,
      select: name => this.props.dispatch(setGasStation(name)),
      selected: this.props.gasStation,
    });
  };

  showGasLevelSelect = () => {
    showModal('modals.Select', {
      title: 'Select Gas Level',
      options: GAS_LEVELS,
      select: name => this.props.dispatch(setGasLevel(name)),
      selected: this.props.gasLevel,
    });
  };
}

export default connect(
  state => ({
    ...state.settings,
  }),
  dispatch => ({dispatch}),
)(SettingsScreen);
