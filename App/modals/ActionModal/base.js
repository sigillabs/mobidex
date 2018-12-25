import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native-elements';
import { connect as connectNavigation } from '../../../navigation';
import { navigationProp } from '../../../types/props';
import BigCenter from '../../components/BigCenter';
import VerticalPadding from '../../components/VerticalPadding';
import RotatingView from '../../components/RotatingView';

class BaseActionModal extends React.PureComponent {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      action: PropTypes.func.isRequired,
      callback: PropTypes.func.isRequired,
      icon: PropTypes.node.isRequired,
      label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired
    };
  }

  componentDidMount() {
    requestAnimationFrame(async () => {
      try {
        await this.props.action();
      } catch (err) {
        this.props.navigation.dismissModal();
        this.props.callback(err);
        return;
      }

      this.props.navigation.dismissModal();
      this.props.callback();
    });
  }

  render() {
    const label =
      typeof this.props.label === 'string' ? (
        <Text>{this.props.label}</Text>
      ) : (
        this.props.label
      );
    return (
      <BigCenter>
        <RotatingView>{this.props.icon}</RotatingView>
        <VerticalPadding size={25} />
        {label}
      </BigCenter>
    );
  }
}

export default connectNavigation(BaseActionModal);
