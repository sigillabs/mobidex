import React from 'react';
import {Navigation} from 'react-native-navigation';
import FA from 'react-native-vector-icons/FontAwesome';
import {showModal} from '../../../../navigation';
import NavigationProvider from '../../../NavigationProvider';
import Base from './base';

export default class DetailsScreen extends React.PureComponent {
  static options() {
    return {
      topBar: {
        visible: true,
        drawBehind: false,
        backButton: {
          color: 'black',
        },
        title: {
          text: 'Trade',
          alignment: 'center',
        },
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  async componentWillMount() {
    const source = await FA.getImageSource('send', 24, '#000000');
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'send',
            icon: source,
          },
        ],
      },
    });
  }

  navigationButtonPressed({buttonId}) {
    if (buttonId === 'send') {
      showModal('modals.Send', this.props);
    }
  }

  render() {
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <Base {...this.props} />
      </NavigationProvider>
    );
  }
}
