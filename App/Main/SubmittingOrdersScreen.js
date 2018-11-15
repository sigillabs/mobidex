import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, View } from 'react-native';
import { Text } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import NavigationService from '../../services/NavigationService';
import { colors } from '../../styles';
import Padding from '../components/Padding';
import RotatingView from '../components/RotatingView';

export default class SubmittingOrdersScreen extends Component {
  static get propTypes() {
    return {
      navigation: PropTypes.shape({
        getParam: PropTypes.func.isRequired
      }).isRequired
    };
  }

  async componentDidMount() {
    const action = this.props.navigation.getParam('action');
    const next = this.props.navigation.getParam('next');

    InteractionManager.runAfterInteractions(async () => {
      try {
        await action();
      } catch (err) {
        NavigationService.error(err);
        return;
      }

      NavigationService.navigate(next);
    });
  }

  render() {
    const text = this.props.navigation.getParam('text');

    return (
      <View
        backgroundColor={colors.transparent}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10
        }}
      >
        <RotatingView>
          <Entypo
            name="chevron-with-circle-up"
            size={100}
            style={{ marginBottom: 25 }}
          />
        </RotatingView>
        <Padding size={25} />
        <Text style={styles.text}>{text}</Text>
        <Padding size={25} />
        <Padding size={25} />
      </View>
    );
  }
}

const styles = {
  text: {
    fontSize: 18,
    color: colors.primary,
    paddingBottom: 10
  }
};
