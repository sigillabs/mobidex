import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as AssetService from '../../../../services/AssetService';
import { connect as connectNavigation } from '../../../../navigation';
import { colors } from '../../../../styles';
import { setUnlimitedProxyAllowance } from '../../../../thunks';
import Button from '../../../components/Button';
import Approving from './Approving';

class ApproveScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    if (this.state.loading) {
      return <Approving />;
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
        <Icon name="unlock" size={100} style={{ marginBottom: 25 }} />
        <Text
          style={{
            fontSize: 18,
            color: colors.primary,
            paddingBottom: 10,
            textAlign: 'center'
          }}
        >
          Unlock {asset.name} for trading.
        </Text>
        <Button
          large
          title="Unlock"
          buttonStyle={{ borderRadius: 0 }}
          onPress={this.submit}
        />
      </View>
    );
  }

  submit = () => {
    const { assetData } = this.props;
    const asset = AssetService.findAssetByData(assetData);

    this.setState({ loading: true });

    requestAnimationFrame(async () => {
      try {
        await this.props.dispatch(setUnlimitedProxyAllowance(asset.address));
        this.props.navigation.pop();
      } catch (err) {
        this.props.navigation.showErrorModal(err);
      } finally {
        this.setState({ loading: false });
      }
    });
  };
}

ApproveScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  assetData: PropTypes.string.isRequired
};

export default connect(() => ({}), dispatch => ({ dispatch }))(
  connectNavigation(ApproveScreen)
);
