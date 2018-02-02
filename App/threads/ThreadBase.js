import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
} from "react-native";
import reactMixin from "react-mixin";
import ReactTimerMixin from "react-timer-mixin";

export default class ThreadBase extends Component {
  static propTypes = {
    timeout: PropTypes.number.isRequired,
    enabled: PropTypes.bool.isRequired
  };

  static defaultProps = {
    timeout: 100,
    enabled: false
  };

  componentDidMount() {
    if (this.props.enabled) {
      this.start();
    }
  }

  componentDidUpdate() {
    if (this.props.enabled) {
      this.start();
    } else {
      this.stop();
    }
  }

  componentWillUnmount() {
    this.stop()
  }

  start = () => {
    if (!this.timer) {
      this.timer = this.setTimeout(this.run, 0);
    }
  };

  run = () => {
    this.execute((err) => {
      if (err) {
        console.warn(error.message, error.stack);
      }

      this.timer = this.setTimeout(this.run, this.props.timeout);
    });
  };

  stop = () => {
    this.clearTimeout(this.timer);
    this.timer = null;
  };

  execute(cb) {
    cb();
  }

  render() {
    return null
  }
}

reactMixin(ThreadBase.prototype, ReactTimerMixin);
