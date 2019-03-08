import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const ButtonStyled = styled(Button)`
  &:not(:disabled) {
    ${props => props.variant === 'contained' && 'color: white !important'};
    ${props => props.important && `background-color: ${props.theme.colors.error} !important`};
  }
`;

const IconSeperator = styled.span`
  padding-right: 8px;
`;

const ButtonWrapper = ({ label, icon, tooltipLabel, tooltipPosition, ...rest }) => {
  if (tooltipLabel) {
    return (
      <Tooltip title={tooltipLabel} aria-label={tooltipLabel} placement={tooltipPosition}>
        <ButtonStyled {...rest}>
          {icon && <IconSeperator>{icon}</IconSeperator>}
          {label}
        </ButtonStyled>
      </Tooltip>
    );
  }

  return (
    <ButtonStyled {...rest}>
      {icon && <IconSeperator>{icon}</IconSeperator>}
      {label}
    </ButtonStyled>
  );
};

ButtonWrapper.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.any,
  tooltipLabel: PropTypes.string,
  tooltipPosition: PropTypes.string,
};

ButtonWrapper.defaultProps = {
  label: null,
  icon: null,
  tooltipLabel: null,
  tooltipPosition: 'bottom',
};

export default ButtonWrapper;
