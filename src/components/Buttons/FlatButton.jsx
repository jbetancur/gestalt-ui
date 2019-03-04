import React from 'react';
import PropTypes from 'prop-types';
// import styled, { css } from 'styled-components';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const ButtonStyled = ({ tooltipLabel, tooltipPosition, ...rest }) => {
  if (tooltipLabel) {
    return (
      <Tooltip title={tooltipLabel} aria-label={tooltipLabel} placement={tooltipPosition}>
        <Button {...rest} />
      </Tooltip>
    );
  }

  return <Button {...rest} />;
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
