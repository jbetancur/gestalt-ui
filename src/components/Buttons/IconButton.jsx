import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  button: {
    margin: 0,
    padding: '8px',
  },
});

const IconButtonStyled = ({ children, tooltipLabel, tooltipPosition, classes, ...rest }) => {
  if (tooltipLabel) {
    return (
      <Tooltip title={tooltipLabel} aria-label={tooltipLabel} placement={tooltipPosition}>
        <IconButton className={classes.button} aria-label="Add to shopping cart" {...rest}>
          {children}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <IconButton className={classes.button} aria-label="Add to shopping cart" {...rest}>
      {children}
    </IconButton>
  );
};

IconButtonStyled.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  tooltipLabel: PropTypes.string,
  tooltipPosition: PropTypes.string,
};

IconButtonStyled.defaultProps = {
  tooltipLabel: null,
  tooltipPosition: 'bottom',
};

export default withStyles(styles)(IconButtonStyled);
