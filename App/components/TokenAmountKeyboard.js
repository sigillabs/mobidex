import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import Button from './Button';

export default class TokenAmountKeyboard extends PureComponent {
  render() {
    return (
      <Fragment>
        <VirtualKeyboard
          color="black"
          pressMode="string"
          onPress={this.onChange}
          decimal={true}
          {...this.props}
        />
        <Button
          large
          title={this.props.buttonTitle}
          icon={this.props.buttonIcon}
          onPress={this.onSubmit}
          containerStyle={{ marginHorizontal: 50, marginTop: 10 }}
          iconRight={this.props.buttonIconRight}
          disabled={this.props.disableButton}
          loading={this.props.buttonLoading}
        />
      </Fragment>
    );
  }

  onChange = value => {
    if (this.props.onChange) this.props.onChange(value);
  };

  onSubmit = () => {
    if (this.props.onSubmit) this.props.onSubmit();
  };
}

TokenAmountKeyboard.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  buttonIcon: PropTypes.node,
  buttonIconRight: PropTypes.bool,
  buttonLoading: PropTypes.bool,
  disableButton: PropTypes.bool
};

TokenAmountKeyboard.defaultProps = {
  buttonTitle: 'Submit',
  disableButton: false
};
