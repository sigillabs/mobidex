import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { styles } from '../../styles';
import { styleProp } from '../../types/props';

export default class Col extends Component {
	static get propTypes() {
		return {
			style: styleProp,
			right: PropTypes.bool
		};
	}

	render() {
		let { right, style, ...rest } = this.props;
		return (
			<View
				{...rest}
				style={[styles.col, style, right ? { alignItems: 'flex-end' } : null]}
			>
				{this.props.children}
			</View>
		);
	}
}
