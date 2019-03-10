import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/Apps';

const AppsIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px`};
  color: ${props => `${props.color}`};
`;

const AppsIcon = ({ size, color, ...rest }) => <AppsIconStyle size={size} color={color} {...rest} />;

AppsIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

AppsIcon.defaultProps = {
  size: 22,
  color: 'action',
};

export default AppsIcon;
