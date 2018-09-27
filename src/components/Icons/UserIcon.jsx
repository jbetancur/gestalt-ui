import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const UserIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const UserIcon = ({ size, ...rest }) => <UserIconStyle size={size} {...rest}>person</UserIconStyle>;

UserIcon.propTypes = {
  size: PropTypes.number
};

UserIcon.defaultProps = {
  size: 24,
};

export default UserIcon;
