import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../styles';
import { styleProp } from '../../types/props';

class Cell extends Component {
  render() {
    if (this.props.filled) {
      return (
        <FontAwesome
          name="circle"
          style={[styles.cell, this.props.style]}
          size={this.props.size}
          color={this.props.color}
        />
      );
    } else {
      return (
        <FontAwesome
          name="circle-o"
          style={[styles.cell, this.props.style]}
          size={this.props.size}
          color={this.props.color}
        />
      );
    }
  }
}

Cell.propTypes = {
  filled: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object
};

Cell.defaultProps = {
  size: 20,
  color: colors.primary
};

export default class PinView extends Component {
  render() {
    const { cellStyle, containerStyle, value } = this.props;
    let characters = (value || '').split('');
    if (characters.length < 6) {
      characters = characters.concat(
        _.times(6 - characters.length, _.constant(''))
      );
    } else if (characters.length > 6) {
      characters = characters.slice(0, 6);
    }
    const cells = characters.map((c, i) => (
      <Cell key={i} filled={Boolean(c)} style={cellStyle} />
    ));

    return <View style={[styles.container, containerStyle]}>{cells}</View>;
  }
}

PinView.propTypes = {
  value: PropTypes.string,
  cellStyle: PropTypes.object,
  containerStyle: styleProp
};

PinView.defaultProps = {
  value: ''
};

const styles = {
  cell: {
    width: 20,
    marginHorizontal: 3
  },
  container: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
