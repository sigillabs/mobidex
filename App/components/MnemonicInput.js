import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { colors } from '../../styles';
import Row from './Row';

class Cell extends Component {
  render() {
    const { containerStyle, onChange, word, ...rest } = this.props;
    return (
      <TouchableOpacity
        style={[styles.cell, containerStyle]}
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
          inputStyle={{ height: 20, width: 100 }}
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

Cell.propTypes = {
  onChange: PropTypes.func.isRequired,
  word: PropTypes.string,
  containerStyle: PropTypes.object
};

export default class MnemonicInput extends Component {
  constructor(props) {
    super(props);

    this.cells = [];
  }

  render() {
    const { words, cellStyle, containerStyle } = this.props;
    const cells = words.map((w, i) => (
      <Cell
        key={`cell-${i}`}
        ref={cell => (this.cells[i] = cell)}
        word={w}
        autoFocus={i === 0}
        containerStyle={cellStyle}
        onChange={value => this.changeWord(i, value)}
        onSubmitEditing={() =>
          this.cells[i + 1] ? this.cells[i + 1].focus() : this.submit()
        }
      />
    ));
    const parts = [
      cells.slice(0, 3),
      cells.slice(3, 6),
      cells.slice(6, 9),
      cells.slice(9, 12)
    ];
    const rows = parts.map((g, i) => <Row key={`row-${i}`}>{g}</Row>);

    return <View style={[styles.container, containerStyle]}>{rows}</View>;
  }

  changeWord(index, value) {
    const words = this.props.words.slice();
    words[index] = value;
    this.props.onChange(words.map(word => word.trim().toLowerCase()));
  }

  submit() {
    this.props.onSubmit();
  }
}

MnemonicInput.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  cellStyle: PropTypes.object,
  containerStyle: PropTypes.object
};

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
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};
