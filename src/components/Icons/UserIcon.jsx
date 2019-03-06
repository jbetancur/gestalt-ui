import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/Person';

const UserIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px !important`};
  color: ${props => `${props.color}`};
`;

const UserIcon = ({ size, color, ...rest }) => <UserIconStyle size={size} color={color} {...rest} />;

UserIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

UserIcon.defaultProps = {
  size: 24,
  color: 'action',
};

export default UserIcon;
