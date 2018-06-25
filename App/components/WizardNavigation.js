import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { colors } from '../../styles';
import Button from './Button';

export default class WizardNavigation extends Component {
  render() {
    let {
      step,
      steps,
      maxStep,
      onSelect,
      containerStyle,
      buttonStyle,
      buttonContainerStyle,
      buttonTitleStyle,
      disabledStyle,
      disabledTitleStyle,
      selectedButtonStyle,
      selectedButtonContainerStyle,
      selectedButtonTitleStyle,
      selectedDisabledStyle,
      selectedDisabledTitleStyle
    } = this.props;

    const stepElements = _.range(1, steps + 1).map(s => {
      const disabled = maxStep ? s > maxStep : s > step;
      return (
        <Button
          large
          key={`step-${s}`}
          onPress={() => onSelect(s)}
          containerStyle={[
            styles.buttonContainer,
            buttonContainerStyle,
            step === s ? styles.selectedButtonContainer : null,
            step === s ? selectedButtonContainerStyle : null
          ]}
          buttonStyle={[
            styles.button,
            buttonStyle,
            step === s ? styles.selectedButton : null,
            step === s ? selectedButtonStyle : null
          ]}
          disabledStyle={[
            styles.disabled,
            disabledStyle,
            step === s ? styles.selectedDisabled : null,
            step === s ? selectedDisabledStyle : null
          ]}
          titleStyle={[
            styles.buttonTitle,
            buttonTitleStyle,
            step === s ? styles.selectedButtonTitle : null,
            step === s ? selectedButtonTitleStyle : null
          ]}
          disabledTitleStyle={[
            styles.disabledTitle,
            disabledTitleStyle,
            step === s ? styles.selectedDisabledTitle : null,
            step === s ? selectedDisabledTitleStyle : null
          ]}
          title={s.toString()}
          disabled={disabled}
        />
      );
    });
    return (
      <View style={[styles.container, containerStyle]}>{stepElements}</View>
    );
  }
}

WizardNavigation.propTypes = {
  steps: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  maxStep: PropTypes.number,
  onSelect: PropTypes.func,
  containerStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  buttonContainerStyle: PropTypes.object,
  buttonTitleStyle: PropTypes.object,
  disabledStyle: PropTypes.object,
  disabledTitleStyle: PropTypes.object,
  selectedButtonStyle: PropTypes.object,
  selectedButtonContainerStyle: PropTypes.object,
  selectedButtonTitleStyle: PropTypes.object,
  selectedDisabledStyle: PropTypes.object,
  selectedDisabledTitleStyle: PropTypes.object
};

const styles = {
  container: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: colors.background,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0
  },
  buttonContainer: {
    backgroundColor: colors.background,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    height: 50,
    flex: 1
  },
  buttonTitle: {
    color: colors.grey2
  },
  disabled: {
    backgroundColor: colors.background,
    borderColor: colors.background
  },
  disabledTitle: {
    color: colors.grey2
  },
  selectedButton: {
    backgroundColor: colors.yellow0,
    borderColor: colors.yellow0
  },
  selectedButtonContainer: {
    flex: 3
  },
  selectedButtonTitle: {
    color: colors.white
  },
  selectedDisabled: {
    backgroundColor: colors.yellow0
  },
  selectedDisabledTitle: {
    color: colors.white
  }
};
