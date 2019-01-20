import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge';

GoogleAnalyticsSettings.setDispatchInterval(30);
GoogleAnalyticsSettings.setDryRun(false);

let _tracker = new GoogleAnalyticsTracker('UA-112618673-2');

export function trackScreen(name) {
  if (!__DEV__) {
    _tracker.trackScreenView(name);
  }
}

export function trackEvent(category, action, values = null) {
  if (!__DEV__) {
    _tracker.trackEvent(category, action, values);
  }
}
