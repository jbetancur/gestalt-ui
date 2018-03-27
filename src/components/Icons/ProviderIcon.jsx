import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const ProviderIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const ProviderIcon = ({ size }) => <ProviderIconStyle size={size}>settings_applications</ProviderIconStyle>;

ProviderIcon.propTypes = {
  size: PropTypes.number
};

ProviderIcon.defaultProps = {
  size: 24,
};

export default ProviderIcon;
