import React from 'react';
import styled, { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';

const ButtonStyle = styled(({ theme, ...rest }) => <Button {...rest} />)`
  color: ${props => props.theme.colors['$md-red-500']};
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99;
`;

const RemoveButton = props => <ButtonStyle icon {...props}>delete</ButtonStyle>;

export default withTheme(RemoveButton);
