import React from 'react';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { toggleShowForex } from '../../../../actions';
import NavigationProvider from '../../../NavigationProvider';
import BaseProductScreen from './base';

class ProductScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          color: 'black'
        },
        title: {
          text: 'Trade',
          alignment: 'center'
        },
        rightButtons: [
          {
            id: 'toggleForexButton',
            text: 'ETH',
            color: 'black'
          }
        ]
      }
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  render() {
    return (
      <NavigationProvider>
        <BaseProductScreen {...this.props} />
      </NavigationProvider>
    );
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'toggleForexButton') {
      this.props.dispatch(toggleShowForex());
    }
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(ProductScreen);
