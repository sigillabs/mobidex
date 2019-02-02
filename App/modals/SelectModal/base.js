import PropTypes from 'prop-types';
import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect as connectNavigation } from '../../../navigation';
import { styles } from '../../../styles';
import { navigationProp } from '../../../types/props';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import Option from './Option';

class BaseSelectModal extends React.Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      select: PropTypes.func.isRequired,
      cancel: PropTypes.func,
      title: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      ).isRequired,
      selected: PropTypes.string
    };
  }

  render() {
    return (
      <SafeAreaView style={[styles.flex1, styles.h100]}>
        <View style={[styles.flex1, styles.bottom]}>
          <Text h3>{this.props.title}</Text>
          <Divider />
        </View>
        <View style={styles.flex2}>
          <FlatList
            data={this.props.options}
            keyExtractor={(item, index) => `option-${index}`}
            renderItem={({ item, index }) => (
              <Option
                {...item}
                index={index}
                selected={item.name === this.props.selected}
                onPress={this.select}
              />
            )}
          />
        </View>
        <Button
          large
          onPress={this.cancel}
          containerStyle={[styles.fluff0, styles.flex0]}
          title="Cancel"
        />
      </SafeAreaView>
    );
  }

  cancel = () => {
    this.props.navigation.dismissModal();
    if (this.props.cancel) {
      this.props.cancel();
    }
  };

  select = name => {
    this.props.select(name);
    this.props.navigation.dismissModal();
  };
}

export default connectNavigation(BaseSelectModal);
