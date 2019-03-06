import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/DeviceHub';

const APIIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px !important`};
  color: ${props => `${props.color}`};
`;

const APIIcon = ({ size, color, ...rest }) => <APIIconStyle size={size} color={color} {...rest} />;

APIIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

APIIcon.defaultProps = {
  size: 24,
  color: 'action',
};

export default APIIcon;
