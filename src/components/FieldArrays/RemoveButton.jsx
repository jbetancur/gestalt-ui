import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import { Button } from 'react-md';
import { media } from 'util/helpers/media';

const ButtonStyle = styled(({ theme, absoluteTopRight, ...rest }) => <Button {...rest} />)`
  color: ${props => props.theme.colors['$md-red-500']};
  ${props => props.absoluteTopRight && css`
    position: absolute;
    top: -15px;
    right: 2px;
  `};
  ${() => media.xs`
    position: absolute;
    top: 4px;
    right: 2px;
  `};
  ${() => media.sm`
    position: absolute;
    top: 4px;
    right: 2px;
  `};
`;

const RemoveButton = ({ onRemove, fieldIndex, ...props }) => {
  const handleRemove = () => onRemove(fieldIndex);

  return <ButtonStyle icon onClick={handleRemove} {...props}>delete</ButtonStyle>;
};

RemoveButton.propTypes = {
  onRemove: PropTypes.func.isRequired,
  fieldIndex: PropTypes.number.isRequired,
  absoluteTopRight: PropTypes.bool,
};

RemoveButton.defaultProps = {
  absoluteTopRight: false,
};

export default withTheme(RemoveButton);
