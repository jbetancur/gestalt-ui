import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';
import { media } from 'util/helpers/media';

const ButtonStyle = styled(({ theme, ...rest }) => <Button {...rest} />) `
  color: ${props => props.theme.colors['$md-red-500']};
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  ${() => media.xs`
    top: 0;
    transform: none;
  `};

  ${() => media.sm`
    top: 0;
    transform: none;
  `};
`;

const RemoveButton = ({ onRemove, index, ...props }) => {
  const handleRemove = () => onRemove(index);

  return <ButtonStyle icon onClick={handleRemove} {...props}>delete</ButtonStyle>;
};

RemoveButton.propTypes = {
  onRemove: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default withTheme(RemoveButton);
