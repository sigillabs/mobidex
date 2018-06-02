import React, { Component } from 'react';
import { AppState, View } from 'react-native';
import Drawer from 'react-native-drawer';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import { closeDrawer } from '../actions';
import { forget, gotoOnboardingOrLocked } from '../thunks';
import { hasWalletOnFileSystem } from '../utils';
import Navigator from './Navigation';
import DrawerController from './DrawerController';

const addListener = createReduxBoundAddListener('root');

class Bootstrap extends Component {
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.props.dispatch(gotoOnboardingOrLocked());
  }

  render() {
    return (
      <Drawer
        open={this.props.drawer.open}
        content={<DrawerController />}
        openDrawerOffset={0.2}
        tapToClose={true}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        tweenHandler={ratio => ({
          main: { opacity: (2 - ratio) / 2 }
        })}
        onClose={() => this.props.dispatch(closeDrawer())}
      >
        <Navigator
          navigation={addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.navigation,
            addListener
          })}
        />
      </Drawer>
    );
  }

  handleAppStateChange = nextAppState => {
    if (nextAppState === 'background') {
      this.props.dispatch(forget());
      this.props.dispatch(gotoOnboardingOrLocked());
    }
  };
}

export default connect(
  ({ navigation, wallet, drawer }) => ({
    navigation,
    drawer,
    wallet
  }),
  dispatch => ({ dispatch })
)(Bootstrap);
