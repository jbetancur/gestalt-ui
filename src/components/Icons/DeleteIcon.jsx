import React from 'react';
import { SVGIcon } from 'react-md';

/* eslint react/jsx-indent: 0 */

// TODO: delete_outline ligature is missing from material-design-icons lib so subing the svg
const DeleteIcon = props => (
  <SVGIcon viewBox="0 0 24 24" className="md-icon material-icons" size={20} {...props}>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
    <path fill="none" d="M0 0h24v24H0V0z" />
  </SVGIcon>
);

export default DeleteIcon;
