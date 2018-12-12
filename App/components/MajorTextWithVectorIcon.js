import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../styles';
import MajorText from './MajorText';

export default class MajorTextWithVectorIcon extends Component {
  static get propTypes() {
    return {
      text: PropTypes.string.isRequired,
      iconName: PropTypes.string.isRequired,
      IconComponent: PropTypes.any.isRequired
    };
  }

  static get defaultProps() {
    return {
      IconComponent: FontAwesome
    };
  }

  render() {
    let { IconComponent, iconName, text } = this.props;
    return (
      <View style={[styles.center, styles.flex1]}>
        <IconComponent name={iconName} size={100} />
        <MajorText>{text}</MajorText>
      </View>
    );
  }
}
