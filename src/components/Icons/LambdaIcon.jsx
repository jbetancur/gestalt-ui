import React from 'react';
import PropTypes from 'prop-types';
import SVGIcon from '@material-ui/core/SvgIcon';

const LambdaIcon = ({ size, ...rest }) => (
  <SVGIcon viewBox="0 0 364.7 364.7" style={{ fontSize: `${size}px` }} {...rest}>
    <path d="M254.1,345.9l-63.1-159.8L98.6,331.9h-58l129.2-208.6l-14.5-41.2H105V32.9h86.1l98.8,251.4l43.5-14.2l14.5,48.7 L254.1,345.9z" />
  </SVGIcon>
);

LambdaIcon.propTypes = {
  size: PropTypes.number
};

LambdaIcon.defaultProps = {
  size: 22,
};

export default LambdaIcon;
