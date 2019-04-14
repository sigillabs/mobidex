import PropTypes from 'prop-types';
import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { checkInternetConnection } from 'react-native-offline';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { setTabsRoot } from '../../navigation';
import { styles } from '../../styles';
import BigCenter from '../components/BigCenter';

class OfflineScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true,
        backButton: {
          visible: false
        },
        title: {
          text: 'Offline',
          alignment: 'center'
        }
      }
    };
  }

  static propTypes = {
    mobidexEndpoint: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  render() {
    return (
      <SafeAreaView style={[styles.h100, styles.w100]}>
        <ScrollView
          contentContainerStyle={[styles.h100, styles.w100]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <BigCenter style={[styles.h100, styles.w100]}>
            <Entypo name="bar-graph" size={100} />
            <Text>
              The network is down for some reason :(. Please refresh to check
              for connectivity.
            </Text>
          </BigCenter>
        </ScrollView>
      </SafeAreaView>
    );
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      const success = await checkInternetConnection();
      if (success) {
        await setTabsRoot();
      }
    } finally {
      this.setState({ refreshing: false });
    }
  };
}

export default connect(
  state => ({ mobidexEndpoint: state.settings.mobidexEndpoint }),
  dispatch => ({ dispatch })
)(OfflineScreen);
