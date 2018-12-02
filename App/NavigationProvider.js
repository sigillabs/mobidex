import PropTypes from 'prop-types';
import React from 'react';
import { Navigation } from 'react-native-navigation';
import {
  buildNavigationComponent,
  NavigationContext,
  showModal,
  showErrorModal
} from '../navigation';

export default class NavigationProvider extends React.Component {
  static get propTypes() {
    return {
      children: PropTypes.node.isRequired
    };
  }

  render() {
    const child = React.Children.only(this.props.children);
    return (
      <NavigationContext.Provider
        value={{
          push: this.push,
          pop: this.pop,
          showModal: showModal,
          showErrorModal: showErrorModal,
          dismissModal: this.dismissModal
        }}
      >
        {child}
      </NavigationContext.Provider>
    );
  }

  push = (name, props) => {
    const child = React.Children.only(this.props.children);
    Navigation.push(child.props.componentId, {
      component: buildNavigationComponent(name, props)
    });
  };

  pop = () => {
    const child = React.Children.only(this.props.children);
    Navigation.pop(child.props.componentId);
  };

  dismissModal = () => {
    const child = React.Children.only(this.props.children);
    Navigation.dismissModal(child.props.componentId);
  };
}
