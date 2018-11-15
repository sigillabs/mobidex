import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import NavigationService from '../../services/NavigationService';
import { initialLoad, startWebsockets } from '../../thunks/boot';
import BigCenter from '../components/BigCenter';
import Padding from '../components/Padding';
import RotatingView from '../components/RotatingView';

class InitialLoadScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(async () => {
      await this.props.dispatch(initialLoad(1));
      this.props.dispatch(startWebsockets());
      NavigationService.navigate('Main');
    });
  }

  render() {
    return (
      <BigCenter>
        <RotatingView>
          <Entypo name="chevron-with-circle-down" size={100} />
        </RotatingView>
        <Padding size={25} />
        <Text>Loading assets, orders, and every thing else...</Text>
        <Padding size={25} />
        <Padding size={25} />
      </BigCenter>
    );
  }
}

export default connect(() => ({}), dispatch => ({ dispatch }))(
  InitialLoadScreen
);
