import React from 'react';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';

const Icon = styled(FontIcon)`
  // color: ${props => props.theme.removeIconColor} !important;
  color: inherit;
`;

const DeleteIcon = () => <Icon>delete_sweep</Icon>;

export default DeleteIcon;
