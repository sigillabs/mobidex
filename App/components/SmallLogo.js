import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { getImage } from '../../utils';
import MutedText from './MutedText';
import Row from './Row';

export default class SmallLogo extends Component {
  static propTypes = {
    avatarProps: PropTypes.shape({
      small: PropTypes.bool,
      medium: PropTypes.bool,
      large: PropTypes.bool,
      xlarge: PropTypes.bool
    })
  };

  static defaultProps = {
    avatarProps: {
      small: true,
      rounded: true,
      activeOpacity: 0.7,
      overlayContainerStyle: { backgroundColor: 'transparent' }
    }
  };

  render() {
    let {
      avatarProps,
      rowStyle,
      titleStyle,
      subtitleStyle,
      title,
      subtitle
    } = this.props;

    if (!avatarProps) avatarProps = {};

    return (
      <Row style={rowStyle}>
        <View style={[styles.avatarContainer]}>
          <Avatar source={getImage(this.props.symbol)} {...avatarProps} />
        </View>
        <View style={[styles.textContainer]}>
          {title ? <Text style={[titleStyle]}>{title}</Text> : null}
          {subtitle ? (
            <MutedText style={[subtitleStyle]}>{subtitle}</MutedText>
          ) : null}
        </View>
      </Row>
    );
  }
}

const styles = {
  avatarContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: 5
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 5
  }
};
