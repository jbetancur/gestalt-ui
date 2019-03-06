import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/Subscriptions';

const EnvironmentIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px !important`};
  color: ${props => `${props.color}`};
`;

const EnvironmentIcon = ({ size, color, ...rest }) => <EnvironmentIconStyle size={size} color={color} {...rest} />;

EnvironmentIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

EnvironmentIcon.defaultProps = {
  size: 24,
  color: 'action',
};

export default EnvironmentIcon;
