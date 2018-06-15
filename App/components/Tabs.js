import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ButtonGroup } from 'react-native-elements';
import { colors } from '../../styles';

export default class Tabs extends Component {
  render() {
    let {
      containerStyle,
      buttonStyle,
      selectedButtonStyle,
      ...rest
    } = this.props;
    return (
      <ButtonGroup
        containerBorderRadius={0}
        buttonStyle={[styles.button, buttonStyle]}
        selectedButtonStyle={[styles.selectedButton, selectedButtonStyle]}
        containerStyle={[styles.container, containerStyle]}
        innerBorderStyle={styles.innerBorder}
        {...rest}
      />
    );
  }
}

Tabs.propTypes = {
  containerStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  selectedButtonStyle: PropTypes.object
};

const styles = {
  container: {
    height: 50,
    borderWidth: 0,
    borderRadius: 0,
    padding: 0,
    margin: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  },
  button: {
    backgroundColor: colors.background,
    color: colors.primary,
    borderLeftWidth: 0,
    borderRightWidth: 0
  },
  selectedButton: {
    backgroundColor: colors.yellow0,
    color: colors.white
  },
  innerBorder: {
    width: 0,
    color: colors.white
  }
};
