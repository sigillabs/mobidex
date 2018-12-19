import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { styles } from '../../styles';
import Button from '../components/Button';
import Row from '../components/Row';

export default class ConfirmationView extends React.Component {
  static get propTypes() {
    return {
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
      ]),
      buttonPropsLeft: PropTypes.object,
      buttonPropsRight: PropTypes.object,
      pressLeft: PropTypes.func.isRequired,
      pressRight: PropTypes.func.isRequired
    };
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props.buttonPropsLeft, nextProps.buttonPropsLeft)) {
      return true;
    }

    if (!_.isEqual(this.props.buttonPropsRight, nextProps.buttonPropsRight)) {
      return true;
    }

    if (!_.isEqual(this.props.children, nextProps.children)) {
      return true;
    }

    if (this.props.pressLeft !== nextProps.pressLeft) {
      return true;
    }

    if (this.props.pressRight !== nextProps.pressRight) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <View style={[styles.flex1]}>
        <View style={[styles.flex1, styles.fluff0, styles.w100]}>
          <ScrollView contentContainerStyle={[styles.flex0, styles.p3]}>
            {this.props.children}
          </ScrollView>
        </View>
        <Row style={[styles.flex0, styles.fluff0]}>
          <Button
            large
            onPress={this.props.pressLeft}
            containerStyle={[styles.fluff0, styles.flex1]}
            loadingStyle={styles.p2}
            {...this.props.buttonPropsLeft}
          />
          <Button
            large
            onPress={this.props.pressRight}
            containerStyle={[styles.fluff0, styles.flex1]}
            loadingStyle={styles.p2}
            {...this.props.buttonPropsRight}
          />
        </Row>
      </View>
    );
  }
}
