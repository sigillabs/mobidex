import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { colors } from '../../styles';

class Cell extends Component {
  render() {
    return (
      <View style={[styles.cell, this.props.containerStyle]}>
        {this.props.filled ? (
          <Text style={[styles.cellText, this.props.textStyle]}>*</Text>
        ) : (
          <Text style={[styles.cellText, this.props.textStyle]}> </Text>
        )}
      </View>
    );
  }
}

Cell.propTypes = {
  filled: PropTypes.bool,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object
};

export default class PinView extends Component {
  render() {
    const { cellStyle, cellTextStyle, containerStyle, value } = this.props;
    let characters = (value || '').split('');
    if (characters.length < 6) {
      characters = characters.concat(
        _.times(6 - characters.length, _.constant(''))
      );
    } else if (characters.length > 6) {
      characters = characters.slice(0, 6);
    }
    const cells = characters.map((c, i) => (
      <Cell
        key={i}
        filled={Boolean(c)}
        containerStyle={cellStyle}
        textStyle={cellTextStyle}
      />
    ));

    return <View style={[styles.container, containerStyle]}>{cells}</View>;
  }
}

PinView.propTypes = {
  value: PropTypes.string,
  cellStyle: PropTypes.object,
  cellTextStyle: PropTypes.object,
  containerStyle: PropTypes.object
};

PinView.defaultProps = {
  value: ''
};

const styles = {
  cell: {
    width: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey3
  },
  cellText: {
    color: colors.grey3,
    fontSize: 20,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
