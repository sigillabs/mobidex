import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles, circles, colors } from '../../styles';
import Row from './Row';

class Circle extends Component {
  static get propTypes() {
    return {
      active: PropTypes.bool,
      label: PropTypes.node,
      index: PropTypes.number,
      onSelect: PropTypes.func
    };
  }

  render() {
    const { active, label } = this.props;

    return (
      <TouchableOpacity
        onPress={this.select}
        style={[
          circles.circle0,
          styles.m1,
          styles.center,
          {
            borderColor: colors.yellow0,
            borderWidth: 1
          },
          active ? { backgroundColor: colors.yellow0 } : null
        ]}
      >
        {typeof label === 'string' ? (
          <Text
            style={[
              active ? { color: colors.white } : { color: colors.yellow0 }
            ]}
          >
            {label}
          </Text>
        ) : (
          label
        )}
      </TouchableOpacity>
    );
  }

  select = () => {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.index);
    }
  };
}

export default class SelectableCirclesRow extends Component {
  static get propTypes() {
    return {
      labels: PropTypes.arrayOf(PropTypes.node).isRequired,
      selectedIndex: PropTypes.number,
      onSelect: PropTypes.func
    };
  }

  render() {
    const { selectedIndex } = this.props;
    return (
      <Row style={styles.center}>
        {this.props.labels.map((label, index) => (
          <Circle
            active={index === selectedIndex}
            label={label}
            index={index}
            onSelect={this.props.onSelect}
            key={index}
          />
        ))}
      </Row>
    );
  }
}
