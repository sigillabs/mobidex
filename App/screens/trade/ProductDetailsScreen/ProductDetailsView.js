import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { push } from '../../../../navigation';
import { styles } from '../../../../styles';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import Padding from '../../../components/Padding';
import Row from '../../../components/Row';
import ProductDetailListItem from './ProductDetailListItem';

export default class ProductDetailsView extends Component {
  static get propTypes() {
    return {
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
      <View style={[styles.flex1, styles.mt2]}>
        {graph}
        <Divider style={[styles.mt0]} />
        <Row style={[styles.justifyCenter]}>
          <Button
            large
            icon={
              <Icon name="arrow-with-circle-left" size={20} color="white" />
            }
            onPress={() =>
              push('navigation.trade.CreateOrder', {
                type: 'fill',
                side: 'buy',
                base,
                quote
              })
            }
            title="Buy"
            containerStyle={[{ width: 150 }, styles.justifyCenter]}
          />
          <Button
            large
            icon={
              <Icon name="arrow-with-circle-right" size={20} color="white" />
            }
            onPress={() =>
              push('navigation.trade.CreateOrder', {
                type: 'fill',
                side: 'sell',
                base,
                quote
              })
            }
            title="Sell"
            containerStyle={[{ width: 150 }, styles.justifyCenter]}
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
}