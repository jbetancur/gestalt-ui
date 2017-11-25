import React from 'react';
import styled, { withTheme } from 'styled-components';
import { FontIcon } from 'react-md';

const Icon = styled(FontIcon)`
  color: inherit;
`;

const DeleteIcon = () => <Icon>delete_sweep</Icon>;

export default withTheme(DeleteIcon);
