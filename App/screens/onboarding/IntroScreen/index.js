import React from 'react';
import NavigationProvider from '../../../NavigationProvider';
import BaseIntroScreen from './base';

export default class IntroScreen extends React.Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true
      }
    };
  }

  render() {
    return (
      <NavigationProvider>
        <BaseIntroScreen {...this.props} />
      </NavigationProvider>
    );
  }
}
