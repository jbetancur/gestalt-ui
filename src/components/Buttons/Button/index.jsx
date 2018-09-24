import React from 'react';
import styled, { css, withTheme } from 'styled-components';
import { Button } from 'react-md';

const EnhancedButton = styled(({ important, outline, ...rest }) => <Button {...rest} />)`
  text-align: center;
  ${props => !props.icon && 'border-radius: 3px'};
  ${props => props.raised && css`
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 1px 0, rgba(0, 0, 0, 0.1) 0 1px 1px 0, rgba(0, 0, 0, 0.2) 0 0 1px -4px;

    &:disabled {
      box-shadow: none;
    }
  `};

  &[type=button] {
    line-height: normal;
    font-weight: normal;
  }

  ${props => props.important && css`
    &:not([disabled]) {
      color: ${props.theme.colors['$md-red-500']};
    }
  `};

  .md-icon-text {
    font-weight: normal;
  }

  .md-icon {
    color: inherit;
  }
`;

export default withTheme(EnhancedButton);
