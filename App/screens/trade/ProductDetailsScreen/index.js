import React from 'react';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { toggleShowForex } from '../../../../actions';
import NavigationProvider from '../../../NavigationProvider';
import BaseProductDetailsScreen from './base';

class ProductDetailsScreen extends React.PureComponent {
  static options(passProps) {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          color: 'black'
        },
        title: {
          component: {
            name: 'header.LogoProductBalance',
            alignment: 'center',
            passProps: {
              quoteSymbol: passProps.quote.symbol,
              baseSymbol: passProps.base.symbol,
              adjusted: false
            }
          }
        },
        rightButtons: [
          {
            id: 'toggleForexButton',
            text: 'ETH',
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
            text: this.props.showForexPrices ? 'USD' : 'ETH',
            color: 'black'
          }
        ]
      }
    });
  }

  render() {
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BaseProductDetailsScreen {...this.props} />
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
)(ProductDetailsScreen);
