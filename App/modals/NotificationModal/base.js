import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect as connectNavigation } from '../../../navigation';
import { styles } from '../../../styles';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';
import VerticalPadding from '../../components/VerticalPadding';

class BaseNotificationModal extends React.PureComponent {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      ok: PropTypes.func,
      icon: PropTypes.node.isRequired,
      label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired
    };
  }

  render() {
    const label =
      typeof this.props.label === 'string' ? (
        <Text h4>{this.props.label}</Text>
      ) : (
        this.props.label
      );
    return (
      <View style={[styles.flex1]}>
        <View
          style={[
            styles.flex1,
            styles.fluff0,
            styles.p2,
            styles.w100,
            styles.center
          ]}
        >
          {this.props.icon}
          <VerticalPadding size={25} />
          {label}
        </View>
        <Button
          large
          onPress={this.ok}
          containerStyle={[styles.fluff0]}
          title="Ok"
        />
      </View>
    );
  }

  ok = () => {
    if (this.props.ok) {
      this.props.ok();
    }
    this.props.navigation.dismissModal();
  };
}

export default connectNavigation(BaseNotificationModal);
