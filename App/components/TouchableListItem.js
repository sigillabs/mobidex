import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { styles } from '../../styles';
import MutedText from './MutedText';
import Row from './Row';

export default class TouchableListItem extends Component {
  static get propTypes() {
    return {
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.node.isRequired,
      onPress: PropTypes.func.isRequired
    };
  }

  render() {
    return (
      <ListItem
        title={<MutedText>{this.props.title}</MutedText>}
        subtitle={
          <TouchableOpacity onPress={this.props.onPress} style={styles.flex1}>
            <Row>
              <View style={styles.flex1}>{this.props.subtitle}</View>
              <EntypoIcon name="chevron-thin-right" color="black" />
            </Row>
          </TouchableOpacity>
        }
      />
    );
  }
}
