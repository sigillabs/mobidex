import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { colors } from '../../styles';
import { styleProp } from '../../types/props';
import Row from './Row';

class Cell extends Component {
  render() {
    const { cellStyle, word, ...rest } = this.props;
    return (
      <TouchableOpacity
        style={[styles.cell, cellStyle]}
        onPress={() => this.input.focus()}
      >
        <TextInputMask
          {...rest}
          type={'custom'}
          autoCapitalize={'none'}
          keyboardType={'ascii-capable'}
          value={word}
          inputStyle={{ height: 20, width: 100 }}
          options={{
            mask: 'AAAAAAAA',
            validator: () => true,
            getRawValue: value => value.replace(/\s+/gi, '')
          }}
          underlineColorAndroid="white"
          disabled={true}
        />
      </TouchableOpacity>
    );
  }
}

Cell.propTypes = {
  word: PropTypes.string,
  cellStyle: PropTypes.object
};

export default class DisplayMnemonic extends Component {
  render() {
    const { mnemonic, cellStyle, containerStyle } = this.props;
    const cells = mnemonic.map((w, i) => (
      <Cell key={`cell-${i}`} word={w} cellStyle={cellStyle} />
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
}

DisplayMnemonic.propTypes = {
  mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
  cellStyle: styleProp,
  containerStyle: styleProp
};

const styles = {
  cell: {
    width: 90,
    height: 50,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
