import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import Navigator from './Navigation';

const addListener = createReduxBoundAddListener('root');

class Onboarding extends Component {
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
  state => ({ navigation: state.navigation.onboarding }),
  dispatch => ({ dispatch })
)(Onboarding);
