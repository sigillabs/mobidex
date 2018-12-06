import React from 'react';
import { Navigation } from 'react-native-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

let history = [];

Navigation.events().registerComponentDidDisappearListener(({ componentId }) => {
  history.splice(history.indexOf(componentId), 1);
});

Navigation.events().registerComponentDidAppearListener(({ componentId }) => {
  history.push(componentId);
});

export const NavigationContext = React.createContext();

export function connect(WrappedComponent) {
  class ConnectedNavigation extends React.Component {
    render() {
      return (
        <NavigationContext.Consumer>
          {navigation => (
            <WrappedComponent navigation={navigation} {...this.props} />
          )}
        </NavigationContext.Consumer>
      );
    }
  }

  return ConnectedNavigation;
}

export function waitForComponentAppear(
  componentId,
  fn,
  wait = 50,
  attempts = 20
) {
  let watcher = () => {
    if (~history.indexOf(componentId)) {
      fn();
    } else if (attempts-- > 0) {
      setTimeout(watcher, wait);
    }
  };
  watcher();
}

export function waitForComponentDisappear(
  componentId,
  fn,
  wait = 50,
  attempts = 20
) {
  let watcher = () => {
    if (!~history.indexOf(componentId)) {
      fn();
    } else if (attempts-- > 0) {
      setTimeout(watcher, wait);
    }
  };
  watcher();
}

export function buildNavigationComponent(id, name, props) {
  const component = {
    name
  };

  if (id) {
    component.id = id;
  }

  if (props) {
    component.passProps = props;
  }

  return component;
}

export function showModal(name, props) {
  Navigation.showModal({
    component: buildNavigationComponent(null, name, props)
  });
}

export function showErrorModal(error) {
  Navigation.showModal({
    component: buildNavigationComponent(null, 'modals.Error', { error })
  });
}

export function setOnboardingRoot() {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'navigation.onboarding.Introduction'
            }
          }
        ]
      }
    }
  });
}

export function setInitialBootRoot() {
  Navigation.setRoot({
    root: {
      component: {
        name: 'navigation.trade.InitialLoadScreen'
      }
    }
  });
}

export async function setTabsRoot() {
  Navigation.setRoot({
    root: {
      bottomTabs: await getBottomTabs()
    }
  });
}

export async function getBottomTabs() {
  const icons = await Promise.all([
    FontAwesome.getImageSource('line-chart', 30),
    Ionicons.getImageSource('ios-book', 30),
    Ionicons.getImageSource('md-card', 30),
    Ionicons.getImageSource('ios-settings', 30)
  ]);
  const [trade, orders, wallet, settings] = icons;
  return {
    children: [
      {
        stack: {
          children: [
            {
              component: {
                name: 'navigation.trade.Products'
              }
            }
          ],
          options: {
            bottomTab: {
              text: 'Trade',
              icon: trade
            }
          }
        }
      },
      {
        stack: {
          children: [
            {
              component: {
                id: 'OrdersList',
                name: 'navigation.orders.List'
              }
            }
          ],
          options: {
            bottomTab: {
              text: 'Orders',
              icon: orders,
              badgeColor: 'red'
            }
          }
        }
      },
      {
        stack: {
          children: [
            {
              component: {
                name: 'navigation.wallet.Accounts'
              }
            }
          ],
          options: {
            bottomTab: {
              text: 'Wallet',
              icon: wallet
            }
          }
        }
      },
      {
        stack: {
          children: [
            {
              component: {
                name: 'navigation.Settings'
              }
            }
          ],
          options: {
            bottomTab: {
              text: 'Settings',
              icon: settings
            }
          }
        }
      }
    ]
  };
}
