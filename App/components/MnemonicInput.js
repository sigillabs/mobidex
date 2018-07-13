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

    this.state = {
      words: _.times(12, _.constant(''))
    };

    this.cells = [];
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      let words = this.props.defaultValue.split(' ');
      if (words.length < 12) {
        words = words.concat(_.times(12 - words.length, _.constant('')));
      } else if (words.length > 12) {
        words = words.slice(0, 12);
      }
      this.setState({ words });
    }
  }

  render() {
    const { cellStyle, containerStyle } = this.props;
    const { words } = this.state;
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
    const words = this.state.words.slice();
    words[index] = value;
    this.setState({ words });

    if (this.props.onChange) this.props.onChange(words.join(' ').toLowerCase());
  }

  submit() {
    const words = this.state.words.slice();
    if (this.props.onSubmit) this.props.onSubmit(words.join(' ').toLowerCase());
  }
}

MnemonicInput.propTypes = {
  defaultValue: PropTypes.string,
  cellStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
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
