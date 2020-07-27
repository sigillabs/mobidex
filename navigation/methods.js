import React from 'react';
import {InteractionManager} from 'react-native';
import {Navigation} from 'react-native-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

let history = [];

Navigation.events().registerComponentDidDisappearListener(({componentId}) => {
  history.splice(history.indexOf(componentId), 1);
});

Navigation.events().registerComponentDidAppearListener(({componentId}) => {
  history.push(componentId);
});

export function waitForComponentAppear(
  componentId,
  fn,
  wait = 50,
  attempts = 20,
  executeOnFailure = true,
) {
  let watcher = () => {
    console.log('history', history, executeOnFailure);
    if (~history.indexOf(componentId)) {
      return fn();
    } else if (attempts-- > 0) {
      return setTimeout(watcher, wait);
    } else if (executeOnFailure) {
      return fn();
    }
  };
  watcher();
}

export function waitForComponentDisappear(
  componentId,
  fn,
  wait = 50,
  attempts = 20,
  executeOnFailure = true,
) {
  let watcher = () => {
    if (!~history.indexOf(componentId)) {
      return fn();
    } else if (attempts-- > 0) {
      return setTimeout(watcher, wait);
    } else if (executeOnFailure) {
      return fn();
    }
  };
  watcher();
}

export function buildNavigationComponent(id, name, props) {
  const component = {
    name,
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
    component: buildNavigationComponent(null, name, props),
  });
}

export function showErrorModal(error) {
  Navigation.showModal({
    component: buildNavigationComponent(null, 'modals.Error', {error}),
  });
}

export function showSuccessModal(label, ok) {
  Navigation.showModal({
    component: buildNavigationComponent(null, 'modals.Notification', {
      icon: <FontAwesome name="check-circle" size={100} />,
      label,
      ok,
    }),
  });
}

export function setOfflineRoot() {
  InteractionManager.runAfterInteractions(async () =>
    Navigation.setRoot({
      root: {
        bottomTabs: await getOfflineBottomTabs(),
      },
    }),
  );
}

export async function getOfflineBottomTabs() {
  const icons = await Promise.all([
    Ionicons.getImageSource('md-funnel', 30),
    Ionicons.getImageSource('md-card', 30),
    Ionicons.getImageSource('ios-settings', 30),
  ]);
  const [offline, wallet, settings] = icons;
  return {
    children: [
      {
        stack: {
          children: [
            {
              component: {
                name: 'navigation.Offline',
              },
            },
          ],
          options: {
            bottomTab: {
              text: 'Offline',
              icon: offline,
              badgeColor: 'red',
            },
          },
        },
      },
      {
        stack: {
          children: [
            {
              component: {
                name: 'navigation.Settings',
              },
            },
          ],
          options: {
            bottomTab: {
              text: 'Settings',
              icon: settings,
            },
          },
        },
      },
    ],
  };
}

export function setOnboardingRoot() {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'navigation.onboarding.Introduction',
            },
          },
        ],
      },
    },
  });
}

export async function setTabsRoot() {
  InteractionManager.runAfterInteractions(async () =>
    Navigation.setRoot({
      root: {
        bottomTabs: await getBottomTabs(),
      },
    }),
  );
}

export async function getBottomTabs() {
  const icons = await Promise.all([
    FontAwesome.getImageSource('line-chart', 30),
    Ionicons.getImageSource('ios-settings', 30),
  ]);
  const [trade, settings] = icons;
  return {
    children: [
      {
        stack: {
          children: [
            {
              component: {
                name: 'navigation.trade.Products',
              },
            },
          ],
          options: {
            bottomTab: {
              text: 'Trade',
              icon: trade,
            },
          },
        },
      },
      {
        stack: {
          children: [
            {
              component: {
                name: 'navigation.Settings',
              },
            },
          ],
          options: {
            bottomTab: {
              text: 'Settings',
              icon: settings,
            },
          },
        },
      },
    ],
  };
}
