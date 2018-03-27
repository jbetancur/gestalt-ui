import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const PolicyIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const PolicyIcon = ({ size }) => <PolicyIconStyle size={size}>verified_user</PolicyIconStyle>;

PolicyIcon.propTypes = {
  size: PropTypes.number
};

PolicyIcon.defaultProps = {
  size: 24,
};

export default PolicyIcon;
