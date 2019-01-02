import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect as connectNavigation } from '../../../../navigation';
import * as AssetService from '../../../../services/AssetService';
import * as WalletService from '../../../../services/WalletService';
import { styles } from '../../../../styles';
import { navigationProp } from '../../../../types/props';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import VerticalPadding from '../../../components/VerticalPadding';
import Row from '../../../components/Row';
import UnlockButton from '../../../components/UnlockButton';
import ProductDetailListItem from './ProductDetailListItem';

class ProductDetailsView extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      base: PropTypes.object,
      quote: PropTypes.object,
      period: PropTypes.string,
      infolist: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          left: PropTypes.node,
          right: PropTypes.node
        })
      ),
      history: PropTypes.array,
      formatAmount: PropTypes.func,
      graph: PropTypes.node
    };
  }

  render() {
    const { infolist, graph } = this.props;
    const feeAsset = AssetService.getFeeAsset();

    return (
      <View style={[styles.flex1, styles.fluff0]}>
        {graph}
        <Divider style={[styles.mt0]} />
        <Row style={[styles.justifyCenter]}>
          {WalletService.isUnlockedByAssetData(feeAsset.assetData)
            ? this.renderActionButtons()
            : this.renderUnlockFeeAssetButton()}
        </Row>
        <VerticalPadding size={10} />
        {infolist.map(({ key, left, right, leftStyle, rightStyle }, index) => (
          <ProductDetailListItem
            key={key}
            left={left}
            right={right}
            leftStyle={leftStyle}
            rightStyle={rightStyle}
            topDivider={index === 0}
          />
        ))}
      </View>
    );
  }

  renderUnlockFeeAssetButton() {
    const { assetData } = AssetService.getFeeAsset();
    return (
      <UnlockButton
        containerStyle={[{ width: 150 }, styles.justifyCenter]}
        assetData={assetData}
      />
    );
  }

  renderActionButtons() {
    return (
      <React.Fragment>
        {this.renderBuyButton()}
        {this.renderSellButton()}
      </React.Fragment>
    );
  }

  renderBuyButton() {
    const { quote } = this.props;
    if (WalletService.isUnlockedByAssetData(quote.assetData)) {
      return (
        <Button
          containerStyle={[{ width: 150 }, styles.justifyCenter]}
          icon={{
            name: 'arrow-with-circle-left',
            size: 20,
            color: 'white',
            type: 'entypo'
          }}
          large
          onPress={this.buy}
          title="Buy"
        />
      );
    } else {
      return <UnlockButton assetData={quote.assetData} />;
    }
  }

  renderSellButton() {
    const { base } = this.props;
    if (WalletService.isUnlockedByAssetData(base.assetData)) {
      return (
        <Button
          containerStyle={[{ width: 150 }, styles.justifyCenter]}
          icon={{
            name: 'arrow-with-circle-right',
            size: 20,
            color: 'white',
            type: 'entypo'
          }}
          large
          onPress={this.sell}
          title="Sell"
          iconRight
        />
      );
    } else {
      return <UnlockButton assetData={base.assetData} />;
    }
  }

  buy = () => {
    const { base, quote } = this.props;
    this.props.navigation.push('navigation.trade.CreateOrder', {
      type: 'fill',
      side: 'buy',
      base,
      quote
    });
  };

  sell = () => {
    const { base, quote } = this.props;
    this.props.navigation.push('navigation.trade.CreateOrder', {
      type: 'fill',
      side: 'sell',
      base,
      quote
    });
  };
}

export default connectNavigation(ProductDetailsView);
