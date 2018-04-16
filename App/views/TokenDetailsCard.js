import * as _ from 'lodash';
import React, { Component } from 'react';
import { Card, Header, Text } from 'react-native-elements';
import LeftRightRow from './LeftRightRow';

export default class TokenDetailsCard extends Component {
  render() {
    let { volume, volatility, change } = this.props;

    return (
      <Card>
        <LeftRightRow
          left={'Volume'}
          right={volume}
          leftStyle={{ fontWeight: 'bold' }}
        />
        <LeftRightRow
          left={'Volatility'}
          right={volatility}
          leftStyle={{ fontWeight: 'bold' }}
        />
        <LeftRightRow
          left={'Change'}
          right={change}
          leftStyle={{ fontWeight: 'bold' }}
        />
      </Card>
    );
  }
}
