import React from 'react';
import { ScrollView, View } from 'react-native';
import { styles } from '../../styles';
import Button from '../components/Button';
import Row from '../components/Row';

export default class ConfirmationLayout extends React.PureComponent {
  render() {
    return (
      <View style={[styles.flex1]}>
        <View style={[styles.flex1, styles.fluff0, styles.w100]}>
          <ScrollView contentContainerStyle={[styles.flex0, styles.p3]}>
            {this.renderTop()}
          </ScrollView>
        </View>
        <Row style={[styles.flex0, styles.fluff0]}>
          <Button
            large
            onPress={this.pressLeft.bind(this)}
            containerStyle={[styles.fluff0, styles.flex1]}
            loadingStyle={styles.p2}
            {...this.getButtonLeftProps()}
          />
          <Button
            large
            onPress={this.pressRight.bind(this)}
            containerStyle={[styles.fluff0, styles.flex1]}
            loadingStyle={styles.p2}
            {...this.getButtonRightProps()}
          />
        </Row>
      </View>
    );
  }

  getButtonLeftProps() {
    throw new Error('getButtonLeftProps must be implemented.');
  }

  getButtonRightProps() {
    throw new Error('getButtonRightProps must be implemented.');
  }

  renderTop() {
    throw new Error('renderTop must be implemented.');
  }

  pressLeft() {
    throw new Error('pressLeft must be implemented.');
  }

  pressRight() {
    throw new Error('pressRight must be implemented.');
  }
}
