import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const ButtonStyled = styled(Button)`
  &:not(:disabled) {
    ${props => props.variant === 'contained' && 'color: white'};
    ${props => props.important && `background-color: ${props.theme.colors.error}`};
  }

  svg {
    vertical-align: top;
  }
`;

const IconSeperator = styled.span`
  ${props => (props.iconAfter
    ? 'padding-left: 8px'
    : 'padding-right: 8px')};
`;

const ButtonWrapper = ({ label, icon, tooltipLabel, tooltipPosition, iconAfter, children, ...rest }) => {
  if (tooltipLabel) {
    return (
      <Tooltip title={tooltipLabel} aria-label={tooltipLabel} placement={tooltipPosition}>
        <ButtonStyled {...rest}>
          {icon && !iconAfter && <IconSeperator iconAfter={iconAfter}>{icon}</IconSeperator>}
          {label}
          {icon && iconAfter && <IconSeperator iconAfter={iconAfter}>{icon}</IconSeperator>}
          {children}
        </ButtonStyled>
      </Tooltip>
    );
  }

  return (
    <ButtonStyled {...rest}>
      {icon && !iconAfter && <IconSeperator iconAfter={iconAfter}>{icon}</IconSeperator>}
      {label}
      {icon && iconAfter && <IconSeperator iconAfter={iconAfter}>{icon}</IconSeperator>}
      {children}
    </ButtonStyled>
  );
};

ButtonWrapper.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.any,
  tooltipLabel: PropTypes.string,
  tooltipPosition: PropTypes.string,
  iconAfter: PropTypes.bool,
  children: PropTypes.any,
};

ButtonWrapper.defaultProps = {
  label: null,
  icon: null,
  tooltipLabel: null,
  tooltipPosition: 'bottom',
  iconAfter: false,
  children: null,
};

export default ButtonWrapper;
