import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as AssetService from '../../../../services/AssetService';
import { connect as connectNavigation } from '../../../../navigation';
import { colors, styles } from '../../../../styles';
import { setNoProxyAllowance } from '../../../../thunks';
import Button from '../../../components/Button';
import Disapproving from './Disapproving';

class DisapproveScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    if (this.state.loading) {
      return <Disapproving />;
    }

    const { assetData } = this.props;
    const asset = AssetService.findAssetByData(assetData);

    return (
      <View
        backgroundColor={colors.transparent}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10
        }}
      >
        <Icon name="lock" size={100} style={{ marginBottom: 25 }} />
        <Text
          style={{
            fontSize: 18,
            color: colors.primary,
            paddingBottom: 10,
            textAlign: 'center'
          }}
        >
          Lock {asset.name} to stop trading.
        </Text>
        <Button
          large
          title="Lock"
          buttonStyle={{ borderRadius: 0 }}
          onPress={() => this.submit()}
        />
      </View>
    );
  }

  async submit() {
    const { assetData } = this.props;
    const asset = AssetService.findAssetByData(assetData);

    this.setState({ loading: true });

    try {
      await this.props.dispatch(setNoProxyAllowance(asset.address));
      this.props.navigation.pop();
    } catch (err) {
      this.props.navigation.showErrorModal(err);
    } finally {
      this.setState({ loading: false });
    }
  }
}

DisapproveScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  assetData: PropTypes.string.isRequired
};

export default connect(state => ({}), dispatch => ({ dispatch }))(
  connectNavigation(DisapproveScreen)
);
