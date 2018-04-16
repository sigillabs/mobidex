import * as _ from 'lodash';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, Overlay, List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

class TokenDropdown extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.props.onPress}>
          <Card
            wrapperStyle={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <Text>{this.props.title} is </Text>
            <Text style={{ fontWeight: 'bold' }}>
              {this.props.token.symbol}
            </Text>
            <View style={{ flexGrow: 1 }} />
            <Icon name="unsorted" style={{ paddingTop: 5, paddingBottom: 5 }} />
          </Card>
        </TouchableOpacity>
        <Overlay isVisible={this.props.show} fullScreen={true}>
          <List containerStyle={{ marginBottom: 20 }}>
            {this.props.tokens.map((token, index) => (
              <ListItem
                component={TouchableOpacity}
                key={index}
                onPress={() => this.props.onSelect(token)}
                // roundAvatar
                // avatar={{uri:l.avatar_url}}
                title={token.symbol}
                titleStyle={{
                  color:
                    this.props.token.address === token.address
                      ? 'blue'
                      : 'black'
                }}
              />
            ))}
          </List>
        </Overlay>
      </View>
    );
  }
}

export default connect(
  state => ({ ...state.device.layout }),
  dispatch => ({ dispatch })
)(TokenDropdown);
