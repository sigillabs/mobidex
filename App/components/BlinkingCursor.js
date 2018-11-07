import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, View } from 'react-native';
import { colors } from '../../styles';

export default class BlinkingCursor extends Component {
  constructor(props) {
    super(props);

    this.opacity = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.opacity, {
          toValue: 1,
          duration: 0,
          delay: this.props.delay,
          useNativeDriver: true
        }),
        Animated.timing(this.opacity, {
          toValue: 0,
          duration: 0,
          delay: this.props.delay,
          useNativeDriver: true
        })
      ])
    ).start();
  }

  render() {
    let { height, width, style, delay, ...rest } = this.props;
    return (
      <Animated.View
        style={[
          styles.default,
          { height, width },
          style,
          { opacity: this.opacity }
        ]}
        {...rest}
      />
    );
  }

  blink() {
    this.setState({ show: !this.state.show });
  }
}

BlinkingCursor.propTypes = {
  delay: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  style: PropTypes.object
};

BlinkingCursor.defaultProps = {
  delay: 300,
  height: 16,
  width: 2
};

const styles = {
  default: {
    backgroundColor: colors.primary
  },
  show: {
    opacity: 1
  },
  hide: {
    opacity: 0
  }
};
