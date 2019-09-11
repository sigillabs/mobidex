import React from 'react';
import { Navigation } from 'react-native-navigation';
import NavigationProvider from '../../../NavigationProvider';
import Base from './base';

export default class DetailsScreen extends React.PureComponent {
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
        }
      }
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  render() {
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <Base {...this.props} />
      </NavigationProvider>
    );
  }
}
