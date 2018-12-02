import PropTypes from 'prop-types';
import React from 'react';
import { InteractionManager, StatusBar } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { initialLoad, startWebsockets } from '../../../thunks/boot';
import { setTabsRoot } from '../../../navigation';
import NavigationProvider from '../../NavigationProvider';
import BigCenter from '../../components/BigCenter';
import Padding from '../../components/Padding';
import RotatingView from '../../components/RotatingView';

class InitialLoadScreen extends NavigationProvider {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    StatusBar.setHidden(true, 'none');

    InteractionManager.runAfterInteractions(async () => {
      await this.props.dispatch(initialLoad(1));
      this.props.dispatch(startWebsockets());
      setTabsRoot();
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
