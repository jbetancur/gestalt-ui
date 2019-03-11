import React from 'react';
import PropTypes from 'prop-types';
import SVGIcon from '@material-ui/core/SvgIcon';

/* eslint react/jsx-indent: 0 */
const ScalaIcon = ({ size, ...rest }) => (
  <SVGIcon viewBox="0 0 256 416" style={{ fontSize: `${size}px` }} {...rest}>
    <path d="M0 288v-32c0-5.394 116.377-14.428 192.2-32 36.628 8.49 63.8 18.969 63.8 32v32c0 13.024-27.172 23.51-63.8 32C116.376 302.425 0 293.39 0 288" fill="#4F4F4F" transform="matrix(1 0 0 -1 0 544)" />
    <path d="M0 160v-32c0-5.394 116.377-14.428 192.2-32 36.628 8.49 63.8 18.969 63.8 32v32c0 13.024-27.172 23.51-63.8 32C116.376 174.425 0 165.39 0 160" fill="#4F4F4F" transform="matrix(1 0 0 -1 0 288)" />
    <path d="M0 224v-96c0 8 256 24 256 64v96c0-40-256-56-256-64" fill="#C40000" transform="matrix(1 0 0 -1 0 416)" /><path d="M0 96V0c0 8 256 24 256 64v96c0-40-256-56-256-64" fill="#C40000" transform="matrix(1 0 0 -1 0 160)" />
    <path d="M0 352v-96c0 8 256 24 256 64v96c0-40-256-56-256-64" fill="#C40000" transform="matrix(1 0 0 -1 0 672)" />
  </SVGIcon>
);

ScalaIcon.propTypes = {
  size: PropTypes.number
};

ScalaIcon.defaultProps = {
  size: 22,
};

export default ScalaIcon;
