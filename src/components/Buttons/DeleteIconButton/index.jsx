import React, { PropTypes } from 'react';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';

const StyledIcon = styled.i`
    color: ${props => props.theme.removeIconColor};
`;

const DeleteIconButton = props =>
  <Button icon {...props}><StyledIcon><FontIcon>{props.icon}</FontIcon></StyledIcon></Button>;

DeleteIconButton.propTypes = {
  icon: PropTypes.string,
};

DeleteIconButton.defaultProps = {
  icon: 'delete',
};

export default DeleteIconButton;
