import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const SecretIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const SecretIcon = ({ size }) => <SecretIconStyle size={size}>lock</SecretIconStyle>;

SecretIcon.propTypes = {
  size: PropTypes.number
};

SecretIcon.defaultProps = {
  size: 24,
};

export default SecretIcon;
