import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Button } from 'react-md';
import Tooltip from '@material-ui/core/Tooltip';

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

  ${props => !props.icon && !props.floating && css`
    border-radius: 3px;
    min-width: 90px;
  `};
  ${props => props.important && css`
  &:not([disabled]) {
    color: ${props.theme.colors.error};
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
        background-color: ${props.theme.colors.error};
      }
    `};
  `};
`;

const ButtonStyled = ({ tooltipLabel, tooltipPosition, ...rest }) => {
  if (tooltipLabel) {
    return (
      <Tooltip title={tooltipLabel} aria-label={tooltipLabel} placement={tooltipPosition}>
        <EnhancedButton {...rest} />
      </Tooltip>
    );
  }

  return <EnhancedButton {...rest} />;
};

ButtonStyled.propTypes = {
  tooltipLabel: PropTypes.string,
  tooltipPosition: PropTypes.string,
};

ButtonStyled.defaultProps = {
  tooltipLabel: null,
  tooltipPosition: 'bottom',
};

export default ButtonStyled;
