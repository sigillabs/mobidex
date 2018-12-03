import React from 'react';
import { Navigation } from 'react-native-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigationProvider from '../../../NavigationProvider';
import BaseOrdersScreen from './base';

export default class OrdersScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          color: 'black'
        },
        title: {
          text: 'My Orders',
          alignment: 'center'
        }
      }
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.updateNavigationWithButton();
  }

  render() {
    return (
      <NavigationProvider>
        <BaseOrdersScreen {...this.props} />
      </NavigationProvider>
    );
  }

  async updateNavigationWithButton() {
    const icon = await MaterialIcons.getImageSource('history', 25);
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'tradeHistory',
            enabled: true,
            icon
          }
        ]
      }
    });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'tradeHistory') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'navigation.orders.TransactionHistory'
        }
      });
    }
  }
}
