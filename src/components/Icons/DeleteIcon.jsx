import React from 'react';
import PropTypes from 'prop-types';
import { SVGIcon } from 'react-md';

/* eslint react/jsx-indent: 0 */

// TODO: delete_outline ligature is missing from material-design-icons lib so subing the svg
const DeleteIcon = ({ size, isRed, ...rest }) => (
  <SVGIcon viewBox="0 0 24 24" size={size} {...rest}>
    <path color={isRed ? '#f44336' : 'none'} d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
    <path fill="none" d="M0 0h24v24H0V0z" />
  </SVGIcon>
);

DeleteIcon.propTypes = {
  size: PropTypes.number,
  isRed: PropTypes.bool,
};

DeleteIcon.defaultProps = {
  size: 20,
  isRed: false,
};


export default DeleteIcon;
