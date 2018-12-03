import React from 'react';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { toggleShowForex } from '../../../../actions';
import NavigationProvider from '../../../NavigationProvider';
import BaseProductDetailsScreen from './base';

class ProductDetailsScreen extends React.Component {
  static options(passProps) {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          color: 'black'
        },
        title: {
          component: {
            name: 'header.LogoTicker',
            alignment: 'center',
            passProps
          }
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
        <BaseProductDetailsScreen {...this.props} />
      </NavigationProvider>
    );
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'toggleForexButton') {
      this.props.dispatch(toggleShowForex());
    }
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  ProductDetailsScreen
);
