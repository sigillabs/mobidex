import PropTypes from 'prop-types';
import React, { Component } from 'react';
import reactMixin from 'react-mixin';
import { View } from 'react-native';
import TimerMixin from 'react-timer-mixin';
import { colors } from '../../styles';

@reactMixin.decorate(TimerMixin)
export default class BlinkingCursor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };

    this.setInterval(() => this.blink(), props.delay);
  }

  render() {
    let { height, width, style, delay, ...rest } = this.props;
    return (
      <View
        style={[
          styles.default,
          { height, width },
          style,
          this.state.show ? styles.show : styles.hide
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
