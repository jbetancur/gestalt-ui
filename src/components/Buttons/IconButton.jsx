import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  button: {
    padding: '8px',
  },
});

const IconButtonStyled = ({ children, icon, tooltipLabel, tooltipPosition, classes, ...rest }) => {
  if (tooltipLabel) {
    return (
      <Tooltip title={tooltipLabel} aria-label={tooltipLabel} placement={tooltipPosition}>
        <IconButton className={classes.button} aria-label="Add to shopping cart" {...rest}>
          {children || icon}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <IconButton className={classes.button} aria-label="Add to shopping cart" {...rest}>
      {children || icon}
    </IconButton>
  );
};

IconButtonStyled.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.any,
  children: PropTypes.any,
  tooltipLabel: PropTypes.string,
  tooltipPosition: PropTypes.string,
};

IconButtonStyled.defaultProps = {
  icon: null,
  children: null,
  tooltipLabel: null,
  tooltipPosition: 'bottom',
};

export default withStyles(styles)(IconButtonStyled);
