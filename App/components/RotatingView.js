import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated } from 'react-native';

export default class RotatingView extends Component {
  static propTypes = {
    duration: PropTypes.number.isRequired
  };

  static defaultProps = {
    duration: 1000
  };

  constructor(props) {
    super(props);

    this.rotation = new Animated.Value(0);
  }

  async componentDidMount() {
    Animated.loop(
      Animated.timing(this.rotation, {
        toValue: 1,
        duration: this.props.duration,
        delay: 0,
        useNativeDriver: true
      })
    ).start();
  }

  render() {
    return (
      <Animated.View
        style={{
          transform: [
            {
              rotateX: this.rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }
          ]
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
