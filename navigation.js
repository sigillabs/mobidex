import { Navigation } from 'react-native-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

let currentComponentId = null;

Navigation.events().registerComponentDidAppearListener(({ componentId }) => {
  currentComponentId = componentId;
});

function buildNavigationComponent(name, props) {
  const component = {
    name
  };

  if (props) {
    component.passProps = props;
  }

  return component;
}

export function push(name, props) {
  Navigation.push(currentComponentId, {
    component: buildNavigationComponent(name, props)
  });
}

export function pop() {
  Navigation.pop(currentComponentId);
}

export function showModal(name, props) {
  Navigation.showModal({
    component: buildNavigationComponent(name, props)
  });
}

export function showErrorModal(error) {
  Navigation.showModal({
    component: buildNavigationComponent('modals.Error', {
      error
    })
  });
}

export function dismissModal() {
  Navigation.dismissModal(currentComponentId);
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
  const icons = await Promise.all([
    FontAwesome.getImageSource('line-chart', 30),
    Ionicons.getImageSource('ios-book', 30),
    Ionicons.getImageSource('md-card', 30),
    Ionicons.getImageSource('ios-settings', 30)
  ]);
  const [trade, orders, wallet, settings] = icons;

  Navigation.setRoot({
    root: {
      bottomTabs: {
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
                    name: 'navigation.orders.List'
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: 'Orders',
                  icon: orders
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
                  icon: settings,
                  badge: '1'
                }
              }
            }
          }
        ]
      }
    }
  });
}
