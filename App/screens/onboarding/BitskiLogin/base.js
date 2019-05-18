import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { styles } from '../../../../styles';
import { connect as connectNavigation } from '../../../../navigation';
import { authorizeBitski } from '../../../../thunks';
import { navigationProp } from '../../../../types/props';
import MutedText from '../../../components/MutedText';

class BaseBitskiLoginScreen extends Component {
  static get propTypes() {
    return {
      dispatch: PropTypes.func.isRequired,
      navigation: navigationProp.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      authorizing: true,
      authorized: false
    };
  }

  async componentDidMount() {
    let authorized = false;

    try {
      await this.props.dispatch(authorizeBitski());
      authorized = true;
    } catch (error) {
      InteractionManager.runAfterInteractions(() => {
        this.props.navigation.pop();
      });
      InteractionManager.runAfterInteractions(() => {
        this.props.navigation.showErrorModal(error);
      });
    }

    this.setState({ authorizing: false, authorized });
  }

  render() {
    if (this.state.authorizing) {
      return this.renderAuthorizing();
    } else if (this.state.authorized) {
      return this.renderAuthorized();
    } else {
      return this.renderUnauthorized();
    }
  }

  renderAuthorized() {
    return (
      <SafeAreaView style={styles.paddedTop}>
        <MutedText>You have successfully logged in with Bitski.</MutedText>
      </SafeAreaView>
    );
  }

  renderUnauthorized() {
    return (
      <SafeAreaView style={styles.paddedTop}>
        <MutedText>We were not able to authorize you with Bitski :(.</MutedText>
      </SafeAreaView>
    );
  }

  renderAuthorizing() {
    return (
      <SafeAreaView style={styles.paddedTop}>
        <MutedText>Authorizing with Bitski.</MutedText>
      </SafeAreaView>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({ dispatch })
)(connectNavigation(BaseBitskiLoginScreen));
