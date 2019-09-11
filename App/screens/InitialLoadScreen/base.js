import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect as connectNavigation, setTabsRoot } from '../../../navigation';
import { navigationProp } from '../../../types/props';
import BigCenter from '../../components/BigCenter';
import VerticalPadding from '../../components/VerticalPadding';
import RotatingView from '../../components/RotatingView';

class BaseInitialLoadScreen extends React.Component {
  static propTypes = {
    navigation: navigationProp.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    requestAnimationFrame(async () => {
      setTabsRoot();
    });
  }

  render() {
    return (
      <BigCenter>
        <RotatingView>
          <Entypo name="chevron-with-circle-down" size={100} />
        </RotatingView>
        <VerticalPadding size={25} />
        <Text>
          Loading assets, orders, and every thing else... This may take a couple
          of minutes.
        </Text>
        <VerticalPadding size={25} />
        <VerticalPadding size={25} />
      </BigCenter>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(connectNavigation(BaseInitialLoadScreen));
