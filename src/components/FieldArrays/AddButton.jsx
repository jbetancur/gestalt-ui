import React from 'react';
import styled, { withTheme, css } from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from 'react-md';
import { media } from 'util/helpers/media';

const ButtonStyle = styled(({ theme, absoluteTopRight, ...rest }) => <Button {...rest} />)`
  margin: 4px 16px 8px 16px;
  color: ${props => props.theme.colors['$md-blue-500']};
  ${props => props.icon && css`
    ${() => media.xs`
      position: absolute;
      top: 4px;
      right: 50px;
    `};
    ${() => media.sm`
      position: absolute;
      top: 4px;
      right: 50px;
    `};
  `};
`;

const AddButton = ({ onClick, label }) => (
  <ButtonStyle
    icon={!label}
    flat={!!label}
    onClick={onClick}
    iconChildren="add"
  >
    {label || 'add'}
  </ButtonStyle>
);

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};

AddButton.defaultProps = {
  label: null,
};

export default withTheme(AddButton);
