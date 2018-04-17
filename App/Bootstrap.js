import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { hasWalletOnFileSystem } from '../utils';
import Navigator from './Navigation';

const addListener = createReduxBoundAddListener('root');

class Bootstrap extends Component {
  async componentDidMount() {
    let hasWallet = await hasWalletOnFileSystem();
    if (hasWallet) {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Locked' }));
    } else {
      this.props.dispatch(
        NavigationActions.navigate({ routeName: 'Onboarding' })
      );
    }
  }

  render() {
    return (
      <Navigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.navigation,
          addListener
        })}
      />
    );
  }
}

export default connect(
  ({ navigation }) => ({
    navigation
  }),
  dispatch => ({ dispatch })
)(Bootstrap);
