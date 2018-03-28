import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const EntitlementIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const EntitlementIcon = ({ size }) => <EntitlementIconStyle size={size}>security</EntitlementIconStyle>;

EntitlementIcon.propTypes = {
  size: PropTypes.number
};

EntitlementIcon.defaultProps = {
  size: 24,
};

export default EntitlementIcon;
