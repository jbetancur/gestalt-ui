import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'react-md/lib/Buttons/Button';

const StyledIcon = styled.span`
  color: ${props => props.theme.colors.error};
`;

const DeleteIconButton = ({ icon, ...rest }) => (
  <Button
    icon
    iconChildren={<StyledIcon>{icon}</StyledIcon>}
    {...rest}
  />);

DeleteIconButton.propTypes = {
  icon: PropTypes.string,
};

DeleteIconButton.defaultProps = {
  icon: 'delete',
};

export default DeleteIconButton;
