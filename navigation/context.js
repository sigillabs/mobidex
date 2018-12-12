import React from 'react';

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
