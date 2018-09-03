import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { colors } from '../../styles';

export default class MnemonicWordInput extends Component {
  static get propTypes() {
    return {
      onChange: PropTypes.func.isRequired,
      word: PropTypes.string,
      cellStyle: PropTypes.object,
      inputStyle: PropTypes.object
    };
  }
  render() {
    const { cellStyle, inputStyle, onChange, word, ...rest } = this.props;
    return (
      <TouchableOpacity
        style={[{ height: 20 }, styles.cell, cellStyle]}
        onPress={() => this.input.focus()}
      >
        <TextInputMask
          {...rest}
          refInput={input => (this.input = input)}
          type={'custom'}
          autoCapitalize={'none'}
          keyboardType={'ascii-capable'}
          value={word}
          onChangeText={onChange}
          inputStyle={[{ width: 100 }, inputStyle]}
          options={{
            mask: 'AAAAAAAA',
            validator: () => true,
            getRawValue: value => value.replace(/\s+/gi, '')
          }}
          underlineColorAndroid="white"
        />
      </TouchableOpacity>
    );
  }

  focus() {
    this.input.focus();
  }
}

const styles = {
  cell: {
    width: 90,
    height: 50,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomWidth: 1,
    // borderBottomColor: colors.grey3,
    borderWidth: 1,
    borderColor: colors.grey3,
    borderRadius: 5
  }
};
