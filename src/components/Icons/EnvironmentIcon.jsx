import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const EnvironmentIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const EnvironmentIcon = ({ size, ...rest }) => <EnvironmentIconStyle size={size} {...rest}>folder_open</EnvironmentIconStyle>;

EnvironmentIcon.propTypes = {
  size: PropTypes.number
};

EnvironmentIcon.defaultProps = {
  size: 24,
};

export default EnvironmentIcon;
