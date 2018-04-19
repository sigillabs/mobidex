import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { getImage } from '../../../utils';
import { colors } from '../../../styles';
import TokenItem from './Item';

class TokenList extends Component {
  render() {
    let { tokens } = this.props;

    return (
      <List
        containerStyle={[
          {
            width: this.props.width
          },
          this.props.style
        ]}
      >
        {tokens.map((token, index) => (
          <TouchableOpacity
            key={`token-${index}`}
            onPress={() => this.props.onPress(token)}
          >
            <ListItem
              roundAvatar
              avatar={getImage(token.symbol)}
              title={<TokenItem token={token} />}
              avatarOverlayContainerStyle={{ backgroundColor: 'transparent' }}
              containerStyle={[
                this.props.token &&
                  this.props.token.address === token.address &&
                  styles.highlight
              ]}
            />
          </TouchableOpacity>
        ))}
      </List>
    );
  }
}

export default connect(
  state => ({ ...state.device.layout, ...state.settings }),
  dispatch => ({ dispatch })
)(TokenList);

const styles = {
  highlight: {
    backgroundColor: colors.grey3,
    borderColor: colors.grey3,
    borderWidth: 1
  }
};
