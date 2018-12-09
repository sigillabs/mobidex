import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, ScrollView } from 'react-native';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { styles } from '../../styles';
import Button from './Button';

export default class TokenAmountKeyboard extends PureComponent {
  static get propTypes() {
    return {
      onChange: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired,
      buttonTitle: PropTypes.string.isRequired,
      buttonIcon: PropTypes.node,
      buttonIconRight: PropTypes.bool,
      buttonLoading: PropTypes.bool,
      disableButton: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      buttonTitle: 'Submit',
      disableButton: false
    };
  }

  render() {
    const {
      buttonTitle,
      buttonIcon,
      buttonIconRight,
      disableButton,
      buttonLoading
    } = this.props;
    return (
      <View style={[styles.flex1]}>
        <View style={[styles.flex1, styles.fluff0, styles.w100]}>
          <ScrollView contentContainerStyle={[styles.flex0, styles.p3]}>
            {this.props.children}
          </ScrollView>
        </View>
        <View style={[styles.flex0, styles.fluff0]}>
          <VirtualKeyboard
            color="black"
            pressMode="string"
            onPress={this.onChange}
            decimal={true}
            {...this.props}
          />
          <Button
            large
            title={buttonTitle}
            icon={buttonIcon}
            onPress={this.onSubmit}
            containerStyle={[styles.fluff0]}
            iconRight={buttonIconRight}
            disabled={disableButton}
            loading={buttonLoading}
            loadingStyle={styles.p2}
          />
        </View>
      </View>
    );
  }

  onChange = value => {
    if (this.props.onChange) this.props.onChange(value);
  };

  onSubmit = () => {
    if (this.props.onSubmit) this.props.onSubmit();
  };
}
