import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MajorText from '../App/components/MajorText';
import MajorTextWithVectorIcon from '../App/components/MajorTextWithVectorIcon';
import {
  showErrorModal,
  showModal,
  showSuccessModal,
  waitForComponentAppear
} from '../navigation';
import * as AssetService from '../services/AssetService';
import { setUnlimitedProxyAllowance, setNoProxyAllowance } from './wallet';

/* eslint-disable */
export function ActionErrorSuccessFlow(
  parentComponentId,
  actionOptions,
  successMessage,
  ok
) {
  return async dispatch => {
    const _actionOptions = {
      ...actionOptions,
      callback: error => {
        waitForComponentAppear(
          parentComponentId,
          () =>
            error ? showErrorModal(error) : showSuccessModal(successMessage, ok)
        );
      }
    };
    showModal('modals.Action', _actionOptions);
  };
}

export function ConfirmActionErrorSuccessFlow(
  parentComponentId,
  confirmationOptions,
  actionOptions,
  successMessage,
  ok
) {
  return async dispatch => {
    const _actionOptions = {
      ...actionOptions,
      callback: error => {
        waitForComponentAppear(
          parentComponentId,
          () =>
            error ? showErrorModal(error) : showSuccessModal(successMessage, ok)
        );
      }
    };
    const _confirmationOptions = {
      ...confirmationOptions,
      confirm: () => showModal('modals.Action', _actionOptions)
    };
    showModal('modals.Confirmation', _confirmationOptions);
  };
}

export function approve(parentComponentId, assetData) {
  return async dispatch => {
    const asset = AssetService.findAssetByData(assetData);
    const actionOptions = {
      action: () => dispatch(setUnlimitedProxyAllowance(asset.address)),
      icon: <FontAwesome name="unlock" size={100} />,
      label: <MajorText>Unlocking...</MajorText>
    };
    const confirmationOptions = {
      label: (
        <MajorTextWithVectorIcon
          text={`Unlock ${asset.name} for trading.`}
          iconName="unlock"
        />
      )
    };
    return dispatch(
      ConfirmActionErrorSuccessFlow(
        parentComponentId,
        confirmationOptions,
        actionOptions,
        'Unlock transaction successfully sent to the Ethereum network. It takes a few minutes for Ethereum to confirm the transaction.'
      )
    );
  };
}

export function disapprove(parentComponentId, assetData) {
  return async dispatch => {
    const asset = AssetService.findAssetByData(assetData);
    const actionOptions = {
      action: () => dispatch(setNoProxyAllowance(asset.address)),
      icon: <FontAwesome name="lock" size={100} />,
      label: <MajorText>Locking...</MajorText>
    };
    const confirmationOptions = {
      label: (
        <MajorTextWithVectorIcon
          text={`Lock ${asset.name} to stop trading.`}
          iconName="lock"
        />
      )
    };
    return await dispatch(
      ConfirmActionErrorSuccessFlow(
        parentComponentId,
        confirmationOptions,
        actionOptions,
        'Lock transaction successfully sent to the Ethereum network. It takes a few minutes for Ethereum to confirm the transaction.'
      )
    );
  };
}
