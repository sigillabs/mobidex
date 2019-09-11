import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { styles } from '../../styles';
import { styleProp } from '../../types/props/styles';
import Button from '../components/Button';

export default class NotificationView extends React.Component {
  static get propTypes() {
    return {
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
      ]),
      buttonProps: PropTypes.object,
      scrollViewContainerStyle: styleProp,
      press: PropTypes.func.isRequired
    };
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props.buttonProps, nextProps.buttonProps)) {
      return true;
    }

    if (!_.isEqual(this.props.children, nextProps.children)) {
      return true;
    }

    if (this.props.press !== nextProps.press) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <SafeAreaView style={[styles.flex1]}>
        <View style={[styles.flex1, styles.fluff0, styles.w100]}>
          <ScrollView
            contentContainerStyle={[
              styles.flex0,
              styles.p3,
              this.props.scrollViewContainerStyle
            ]}
          >
            {this.props.children}
          </ScrollView>
        </View>
        <Button
          large
          onPress={this.props.press}
          containerStyle={[styles.fluff0]}
          {...this.props.buttonProps}
        />
      </SafeAreaView>
    );
  }
}
