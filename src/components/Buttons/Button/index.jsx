import React from 'react';
import styled, { css, withTheme } from 'styled-components';
import { Button } from 'react-md';

const EnhancedButton = styled(({ important, outline, ...rest }) => <Button {...rest} />)`
  text-align: center;

  &[type=button] {
    line-height: normal;
    font-weight: normal;
  }
  .md-icon-text {
    font-weight: normal;
  }

  .md-icon {
    color: inherit;
  }

  ${props => !props.icon && !props.floating && 'border-radius: 3px'};
    ${props => props.important && css`
    &:not([disabled]) {
      color: ${props.theme.colors['$md-red-500']};
    }
  `};
  ${props => props.raised && css`
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 1px 0, rgba(0, 0, 0, 0.1) 0 1px 1px 0, rgba(0, 0, 0, 0.2) 0 0 1px -4px;

    &:disabled {
      box-shadow: none;
    }

    ${props.important && css`
      &:not([disabled]) {
        color: white;
        background-color: ${props.theme.colors['$md-red-500']};
      }
    `};
  `};
`;

export default withTheme(EnhancedButton);
