import React, { useState, Fragment, Children } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { IconButton } from 'components/Buttons';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';

const buttonColor = css`
  color: ${props => props.theme.colors[props.flatColor]} !important;
  ${props => props.variant === 'outlined' && `border: 1px solid ${props.theme.colors[props.flatColor]} !important`};

  svg {
    color: ${props => props.theme.colors[props.flatColor]} !important;
  }
`;

const ButtonStyled = styled(({ flatColor, ...rest }) => <Button {...rest} />)`
  ${props => props.flatColor && buttonColor}
`;

const IconSeperator = styled.span`
  ${props => (props.iconAfter
    ? 'padding-left: 8px'
    : 'padding-right: 8px')};
`;

const MenuButton = ({ icon, iconAfter, children, onClose, flat, flatVariant, flatColor, label, ...rest }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
    onClose();
  }

  return (
    <Fragment>
      {flat ? (
        <ButtonStyled
          aria-label="More"
          aria-owns={open ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          variant={flatVariant}
          flatColor={flatColor}
        >
          {icon && !iconAfter && <IconSeperator>{icon}</IconSeperator>}
          {label}
          {icon && iconAfter && <IconSeperator iconAfter>{icon}</IconSeperator>}
        </ButtonStyled>
      ) : (
        <IconButton
          aria-label="More"
          aria-owns={open ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          {icon}
        </IconButton>
      )}
      <Menu
        {...rest}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        // PaperProps={{
        //   style: {
        //     maxHeight: ITEM_HEIGHT * 4.5,
        //     width: 200,
        //   },
        // }}
      >
        {children && Children.map(children, child =>
          React.cloneElement(<div role="button" aria-hidden onClick={handleClose}>{child}</div>))}
      </Menu>
    </Fragment>
  );
};

MenuButton.propTypes = {
  children: PropTypes.any.isRequired,
  icon: PropTypes.any,
  iconAfter: PropTypes.bool,
  onClose: PropTypes.func,
  flat: PropTypes.bool,
  flatVariant: PropTypes.oneOf(['text', 'contained', 'outlined', 'fab', 'extendedFab']),
  flatColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  label: PropTypes.string,
};

MenuButton.defaultProps = {
  icon: null,
  iconAfter: false,
  onClose: () => { },
  flat: false,
  flatVariant: 'text',
  flatColor: false,
  label: null,
};

export default MenuButton;
