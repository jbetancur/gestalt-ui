import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const IconSeperator = styled.span`
  padding-right: 8px;
`;

const ButtonStyled = ({ label, icon, tooltipLabel, tooltipPosition, ...rest }) => {
  if (tooltipLabel) {
    return (
      <Tooltip title={tooltipLabel} aria-label={tooltipLabel} placement={tooltipPosition}>
        <Button {...rest}>
          {icon && <IconSeperator>{icon}</IconSeperator>}
          {label}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button {...rest}>
      {icon && <IconSeperator>{icon}</IconSeperator>}
      {label}
    </Button>
  );
};

ButtonStyled.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.any,
  tooltipLabel: PropTypes.string,
  tooltipPosition: PropTypes.string,
};

ButtonStyled.defaultProps = {
  label: null,
  icon: null,
  tooltipLabel: null,
  tooltipPosition: 'bottom',
};

export default ButtonStyled;
