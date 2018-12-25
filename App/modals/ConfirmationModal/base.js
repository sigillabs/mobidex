import PropTypes from 'prop-types';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect as connectNavigation } from '../../../navigation';
import { styles } from '../../../styles';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';
import Row from '../../components/Row';

class BaseConfirmationModal extends React.PureComponent {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      confirm: PropTypes.func.isRequired,
      cancel: PropTypes.func,
      label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired
    };
  }

  render() {
    const label =
      typeof this.props.label === 'string' ? (
        <Text>{this.props.label}</Text>
      ) : (
        this.props.label
      );
    return (
      <SafeAreaView style={[styles.flex1]}>
        <View style={[styles.flex1, styles.fluff0, styles.w100]}>{label}</View>
        <Row style={[styles.flex0, styles.fluff0]}>
          <Button
            large
            onPress={this.cancel}
            containerStyle={[styles.fluff0, styles.flex1]}
            title="Cancel"
          />
          <Button
            large
            onPress={this.confirm}
            containerStyle={[styles.fluff0, styles.flex1]}
            title="Confirm"
          />
        </Row>
      </SafeAreaView>
    );
  }

  cancel = () => {
    this.props.navigation.dismissModal();
    if (this.props.cancel) {
      this.props.cancel();
    }
  };

  confirm = () => {
    this.props.confirm();
    this.props.navigation.dismissModal();
  };
}

export default connectNavigation(BaseConfirmationModal);
