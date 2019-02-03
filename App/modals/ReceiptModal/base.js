import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InteractionManager, SafeAreaView, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { connect as connectNavigation } from '../../../navigation';
import { styles } from '../../../styles';
import { ActionErrorSuccessFlow, refreshGasPrice } from '../../../thunks';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';
import Row from '../../components/Row';
import Receipt from '../../views/Receipt';

class BaseReceiptModal extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      action: PropTypes.func.isRequired,
      gas: PropTypes.instanceOf(BigNumber).isRequired,
      gasPrice: PropTypes.instanceOf(BigNumber).isRequired,
      value: PropTypes.instanceOf(BigNumber),
      dispatch: PropTypes.func.isRequired
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(async () => {
      this.props.dispatch(refreshGasPrice());
    });
  }

  render() {
    return (
      <SafeAreaView style={[styles.flex1]}>
        <View style={[styles.flex1]}>
          <Receipt {...this.props} />
        </View>
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

  getTotalGasCost = () => {
    const { gasPrice, gas } = this.props;
    return Web3Wrapper.toUnitAmount(gasPrice.mul(gas), 18);
  };

  cancel = () => this.props.navigation.dismissModal();

  submit = () => {
    this.props.dispatch(
      ActionErrorSuccessFlow(
        this.props.navigation.componentId,
        {
          action: this.props.action,
          icon: <Entypo name="chevron-with-circle-up" size={100} />,
          label: 'Submitting To The Ethereum Network...'
        },
        'Submitting To Network',
        () => this.props.navigation.dismissModal()
      )
    );
  };
}

export default connect(
  ({ wallet: { web3 }, settings: { gasPrice } }) => ({ web3, gasPrice }),
  dispatch => ({ dispatch })
)(connectNavigation(BaseReceiptModal));
