import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const AppDeploymentIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const AppDeploymentIcon = ({ size }) => <AppDeploymentIconStyle size={size}>apps</AppDeploymentIconStyle>;

AppDeploymentIcon.propTypes = {
  size: PropTypes.number
};

AppDeploymentIcon.defaultProps = {
  size: 24,
};

export default AppDeploymentIcon;
