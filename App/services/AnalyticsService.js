import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge';

GoogleAnalyticsSettings.setDispatchInterval(30);
GoogleAnalyticsSettings.setDryRun(false);

let _tracker = new GoogleAnalyticsTracker('UA-112618673-2');

export function trackScreen(name) {
  _tracker.trackScreenView(name);
}

export function trackEvent(category, action, values = null) {
  _tracker.trackEvent(category, action, values);
}

export function wrapRouter(router) {
  return {
    ...router,
    getStateForAction: (action, lastState) => {
      if (action.type === 'Navigation/NAVIGATE') {
        trackScreen(action.routeName);
      }
      return router.getStateForAction(action, lastState);
    }
  };
}
