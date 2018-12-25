import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect as connectNavigation } from '../../../../navigation';
import { styles } from '../../../../styles';
import { navigationProp } from '../../../../types/props';
import Divider from '../../../components/Divider';
import Padding from '../../../components/Padding';
import Row from '../../../components/Row';
import ActionOrUnlockButton from '../../../views/ActionOrUnlockButton';
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
    const { base, quote, infolist, graph } = this.props;

    return (
      <View style={[styles.flex1, styles.fluff0]}>
        {graph}
        <Divider style={[styles.mt0]} />
        <Row style={[styles.justifyCenter]}>
          <ActionOrUnlockButton
            assetData={quote.assetData}
            containerStyle={[{ width: 150 }, styles.justifyCenter]}
            icon={
              <Entypo name="arrow-with-circle-left" size={20} color="white" />
            }
            large
            onPress={this.buy}
            title="Buy"
            unlockProps={{
              icon: <FontAwesome name="lock" size={20} color="white" />,
              title: 'Unlock Buy'
            }}
          />
          <ActionOrUnlockButton
            assetData={base.assetData}
            containerStyle={[{ width: 150 }, styles.justifyCenter]}
            icon={
              <Entypo name="arrow-with-circle-right" size={20} color="white" />
            }
            iconRight
            large
            onPress={this.sell}
            title="Sell"
            unlockProps={{
              icon: <FontAwesome name="lock" size={20} color="white" />,
              title: 'Unlock Sell'
            }}
          />
        </Row>
        <Padding size={10} />
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
