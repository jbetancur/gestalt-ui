import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'react-md/lib/Buttons/Button';

const EnhancedButton = styled(Button)`
  @media (min-width: 0) and (max-width: 599px) {
    display: none;
  }
`;

const NavUpArrowButton = props =>
  !!props.visible &&
  <EnhancedButton
    icon
    tooltipLabel="up one level"
    tooltipPosition="bottom"
    {...props}
  >
    arrow_upward
  </EnhancedButton>;

NavUpArrowButton.propTypes = {
  visible: PropTypes.bool,
};

NavUpArrowButton.defaultProps = {
  visible: true,
};

export default NavUpArrowButton;
