import * as _ from 'lodash';
import React from 'react';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { toggleShowForex } from '../../../../actions';
import NavigationProvider from '../../../NavigationProvider';
import BaseProductScreen from './base';

class ProductScreen extends React.PureComponent {
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
        },
        rightButtons: [
          {
            id: 'toggleForexButton',
            text: 'WETH',
            color: 'black'
          }
        ]
      }
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentDidUpdate() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'toggleForexButton',
            text: this.props.showForexPrices ? 'USD' : 'WETH',
            color: 'black'
          }
        ]
      }
    });
  }

  render() {
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BaseProductScreen {..._.omit(this.props, ['showForexPrices'])} />
      </NavigationProvider>
    );
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'toggleForexButton') {
      this.props.dispatch(toggleShowForex());
    }
  }
}

export default connect(
  ({ settings: { showForexPrices } }) => ({ showForexPrices }),
  dispatch => ({ dispatch })
)(ProductScreen);
