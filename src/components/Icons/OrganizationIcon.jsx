import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const OrganizationIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const OrganizationIcon = ({ size }) => <OrganizationIconStyle size={size}>domain</OrganizationIconStyle>;

OrganizationIcon.propTypes = {
  size: PropTypes.number
};

OrganizationIcon.defaultProps = {
  size: 24,
};

export default OrganizationIcon;
