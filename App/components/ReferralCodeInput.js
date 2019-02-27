import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input } from 'react-native-elements';
import SmallClearButton from './SmallClearButton';
import Row from './Row';

export default class ReferralCodeInput extends Component {
  static get propTyeps() {
    return {
      onSubmit: PropTypes.func,
      containerStyle: PropTypes.object,
      wrapperStyle: PropTypes.object
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  render() {
    const { ...rest } = this.props;
    return (
      <Row>
        <Input
          placeholder="Referral code"
          onChangeText={this.onChange}
          keyboardType="ascii-capable"
          inputStyle={{ marginLeft: 0 }}
          inputContainerStyle={{ borderBottomWidth: 0, padding: 0 }}
          containerStyle={{ flex: 1, marginBottom: 0, marginLeft: 0 }}
          {...rest}
        />
        <SmallClearButton title="Submit" onPress={this.onSubmit} />
      </Row>
    );
  }

  onChange = value => this.setState({ value });

  onSubmit = () => {
    const { value } = this.state;
    if (this.props.onSubmit) {
      this.props.onSubmit(value);
    }
  };
}
