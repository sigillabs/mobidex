import React, { Component } from 'react';
import Button from './Button';
import { colors } from '../../styles';

export default class LongButton extends Component {
  render() {
    let { containerStyle, style, wrapperStyle, ...rest } = this.props;
    return (
      <Button
        containerStyle={[
          { flex: 1, width: '100%', flexDirection: 'row' },
          containerStyle
        ]}
        style={[{ flex: 1 }, style]}
        wrapperStyle={[{ flex: 1 }, wrapperStyle]}
        titleStyle={{ flex: 1 }}
        {...rest}
      />
    );
  }
}
