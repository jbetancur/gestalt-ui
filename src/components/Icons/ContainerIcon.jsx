import React from 'react';
import PropTypes from 'prop-types';
import SVGIcon from '@material-ui/core/SvgIcon';

/* eslint react/jsx-indent: 0 */
const ContainerIcon = ({ size, ...rest }) => (
  <SVGIcon viewBox="0 0 24 24" style={{ fontSize: `${size}px` }} {...rest}>
    <path d="M21 4c0-1.104-.896-2-2-2h-15c-1.104 0-2 .896-2 2v15c0 1.104.896 2 2 2h15c1.104 0 2-.896 2-2v-15zm-2 14.25c0 .414-.336.75-.75.75h-13.5c-.414 0-.75-.336-.75-.75v-13.5c0-.414.336-.75.75-.75h13.5c.414 0 .75.336.75.75v13.5zm-9 3.75v1h-1v-1h1zm2 0v1h-1v-1h1zm-4 0v1h-1v-1h1zm6 0v1h-1v-1h1zm2 0v1h-1v-1h1zm-6-22v1h-1v-1h1zm2 0v1h-1v-1h1zm-4 0v1h-1v-1h1zm6 0v1h-1v-1h1zm2 0v1h-1v-1h1zm6 13h1v1h-1v-1zm0-4h1v1h-1v-1zm0-2h1v1h-1v-1zm0 4h1v1h-1v-1zm0 4h1v1h-1v-1zm-22-2h1v1h-1v-1zm0-4h1v1h-1v-1zm0-2h1v1h-1v-1zm0 4h1v1h-1v-1zm0 4h1v1h-1v-1zm11-4h-5v-5h5v5zm6 0h-5v-5h5v5zm-6 6h-5v-5h5v5zm6 0h-5v-5h5v5z" />
  </SVGIcon>
);

ContainerIcon.propTypes = {
  size: PropTypes.number,
};

ContainerIcon.defaultProps = {
  size: 22
};

export default ContainerIcon;
