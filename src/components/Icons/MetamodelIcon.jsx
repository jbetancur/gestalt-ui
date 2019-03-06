import React from 'react';
import PropTypes from 'prop-types';
import SVGIcon from '@material-ui/core/SvgIcon';

/* eslint react/jsx-indent: 0 */
const MetamodelIcon = ({ size, ...rest }) => (
  <SVGIcon viewBox="0 0 24 24" style={{ fontSize: `${size}px` }} {...rest}>
    <path d="M14 2v2h-4v-2h4zm2-2h-8v6h8v-6zm-10 20v2h-4v-2h4zm2-2h-8v6h8v-6zm14 2v2h-4v-2h4zm2-2h-8v6h8v-6zm-3-2h-2c0-3.75-4.967-1.207-6.942-4.753-1.965 3.526-7.134 1.016-7.142 4.753h-1.916c.003-6.521 7.384-1.532 8-8h2c.616 6.473 8 1.469 8 8z" />
  </SVGIcon>
);

MetamodelIcon.propTypes = {
  size: PropTypes.number
};

MetamodelIcon.defaultProps = {
  size: 24,
};

export default MetamodelIcon;
