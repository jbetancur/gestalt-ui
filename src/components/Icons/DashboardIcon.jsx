import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const DashboardIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const APIIcon = ({ size }) => <DashboardIconStyle size={size}>apps</DashboardIconStyle>;

APIIcon.propTypes = {
  size: PropTypes.number
};

APIIcon.defaultProps = {
  size: 24,
};

export default APIIcon;
