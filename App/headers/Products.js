import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { push } from '../../navigation';
import { colors } from '../../styles';
import FakeHeaderButton from '../components/FakeHeaderButton';
import ToggleForexButton from '../views/ToggleForexButton';

const DEFAULT_TITLE = 'Trade';

class ProductsHeader extends Component {
  static get propTypes() {
    return {
      showBackButton: PropTypes.bool,
      showForexToggleButton: PropTypes.bool,
      title: PropTypes.string,
      dispatch: PropTypes.func.isRequired
    };
  }

  render() {
    return (
      <Header
        backgroundColor={colors.background}
        statusBarProps={{ barStyle: 'light-content' }}
        leftComponent={
          this.props.showBackButton ? (
            <TouchableOpacity style={{ padding: 10 }} onPress={() => pop()}>
              <Icon name="arrow-back" color="black" size={15} />
            </TouchableOpacity>
          ) : (
            <FakeHeaderButton />
          )
        }
        centerComponent={{
          text: this.renderTitle(),
          style: { color: 'black', fontSize: 18 }
        }}
        rightComponent={
          this.props.showForexToggleButton ? <ToggleForexButton /> : null
        }
        outerContainerStyles={{ height: 60, paddingTop: 0 }}
      />
    );
  }

  renderTitle() {
    if (this.props.title) {
      return this.props.title;
    }

    return DEFAULT_TITLE;
  }
}

export default connect(
  state => ({
    assets: state.relayer.assets
  }),
  dispatch => ({ dispatch })
)(ProductsHeader);
