import PropTypes from 'prop-types';
import * as _ from 'lodash';
import React from 'react';
import {
  Clipboard,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { setGasLevel, setGasStation } from '../../actions';
import { addReferrer, loadUser } from '../../thunks';
import { showModal } from '../../navigation';
import { clearState } from '../../store';
import { colors, styles } from '../../styles';
import { clearCache } from '../../utils';
import Divider from '../components/Divider';
import MutedText from '../components/MutedText';
import ReferralCodeInput from '../components/ReferralCodeInput';

const GAS_STATIONS = [
  { name: 'default', label: 'default' },
  { name: 'eth-gas-station-info', label: 'ethgasstation.info' },
  { name: 'ether-chain-gas-price-oracle', label: 'etherchain.info' }
];

const GAS_LEVELS = [
  { name: 'low', label: 'Slow  (< 30 min)' },
  { name: 'standard', label: 'Average (< 15 min)' },
  { name: 'high', label: 'Fast (< 2 min)' }
];

class SettingsScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          visible: false
        },
        title: {
          text: 'Settings',
          alignment: 'center'
        }
      }
    };
  }

  static propTypes = {
    network: PropTypes.number.isRequired,
    mobidexEndpoint: PropTypes.string.isRequired,
    relayerEndpoint: PropTypes.string.isRequired,
    forexCurrency: PropTypes.string.isRequired,
    quoteSymbol: PropTypes.string.isRequired,
    gasStation: PropTypes.string.isRequired,
    gasLevel: PropTypes.string.isRequired,
    referralCode: PropTypes.string,
    referrerCode: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  render() {
    const {
      network,
      mobidexEndpoint,
      relayerEndpoint,
      forexCurrency,
      quoteSymbol,
      gasStation,
      gasLevel,
      referralCode,
      referrerCode
    } = this.props;

    return (
      <SafeAreaView style={[styles.h100, styles.w100]}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <ListItem
            title={<MutedText>Forex Currency</MutedText>}
            subtitle={<Text>{forexCurrency}</Text>}
          />
          <ListItem
            title={<MutedText>Quote Token</MutedText>}
            subtitle={<Text>{quoteSymbol}</Text>}
          />
          <Divider style={[styles.p2, { backgroundColor: colors.grey6 }]} />
          <ListItem
            title={<MutedText>Network</MutedText>}
            subtitle={<Text>{network}</Text>}
          />
          <ListItem
            title={<MutedText>Relayer Endpoint</MutedText>}
            subtitle={<Text>{relayerEndpoint}</Text>}
          />
          <ListItem
            title={<MutedText>Mobidex Endpoint</MutedText>}
            subtitle={<Text>{mobidexEndpoint}</Text>}
          />
          <ListItem
            title={<MutedText>Gas Level</MutedText>}
            subtitle={
              <TouchableOpacity onPress={this.showGasLevelSelect}>
                <Text>{_.find(GAS_LEVELS, { name: gasLevel }).label}</Text>
              </TouchableOpacity>
            }
          />
          <ListItem
            title={<MutedText>Gas Station</MutedText>}
            subtitle={
              <TouchableOpacity onPress={this.showGasStationSelect}>
                <Text>{_.find(GAS_STATIONS, { name: gasStation }).label}</Text>
              </TouchableOpacity>
            }
          />
          {referralCode ? (
            <ListItem
              title={<MutedText>Referrer Code</MutedText>}
              subtitle={
                <TouchableOpacity onPress={this.copyReferrerCode}>
                  <Text>{referrerCode}</Text>
                </TouchableOpacity>
              }
            />
          ) : (
            <ListItem
              title={<ReferralCodeInput onSubmit={this.addReferer} />}
            />
          )}
          <Divider style={[styles.p2, { backgroundColor: colors.grey6 }]} />
          <ListItem
            title={<MutedText>Clear Cache</MutedText>}
            subtitle={
              <TouchableOpacity onPress={this.clearCache}>
                <Text>Tap Here</Text>
              </TouchableOpacity>
            }
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      await this.props.dispatch(loadUser());
    } catch (err) {
      // console.warn(err);
    }
    this.setState({ refreshing: false });
  };

  clearCache = () => {
    clearState();
    clearCache();
  };

  showGasStationSelect = () => {
    showModal('modals.Select', {
      title: 'Select Gas Station',
      options: GAS_STATIONS,
      select: name => this.props.dispatch(setGasStation(name)),
      selected: this.props.gasStation
    });
  };

  showGasLevelSelect = () => {
    showModal('modals.Select', {
      title: 'Select Gas Level',
      options: GAS_LEVELS,
      select: name => this.props.dispatch(setGasLevel(name)),
      selected: this.props.gasLevel
    });
  };

  addReferer = async code => {
    try {
      await this.props.dispatch(addReferrer(code));
    } catch (err) {
      // console.warn(err);
    }
  };

  copyReferrerCode = () => {
    Clipboard.setString(this.props.referrerCode);
  };
}

export default connect(
  state => ({
    ...state.settings,
    referralCode: state.wallet.referralCode,
    referrerCode: state.wallet.referrerCode
  }),
  dispatch => ({ dispatch })
)(SettingsScreen);
