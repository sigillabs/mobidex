import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { toggleShowForex } from '../../actions';
import FormattedSymbol from './FormattedSymbol';

class ToggleForexButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => this.props.dispatch(toggleShowForex())}
      >
        {this.props.settings.showForexPrices ? (
          <Icon name="attach-money" color="black" size={15} />
        ) : (
          <FormattedSymbol symbol={this.props.settings.quoteSymbol} />
        )}
      </TouchableOpacity>
    );
  }
}

ToggleForexButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    showForexPrices: PropTypes.bool.isRequired,
    quoteSymbol: PropTypes.string.isRequired
  }).isRequired
};

export default connect(
  state => ({
    settings: state.settings
  }),
  dispatch => ({ dispatch })
)(ToggleForexButton);
