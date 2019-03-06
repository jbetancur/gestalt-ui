import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { IconButton } from 'components/Buttons';
import { DeleteIcon } from 'components/Icons';
import { media } from 'util/helpers/media';

const ButtonStyle = styled(({ theme, absoluteTopRight, ...rest }) => <IconButton {...rest} />)`
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

  return <ButtonStyle disableRipple onClick={handleRemove} {...props}><DeleteIcon size={22} /></ButtonStyle>;
};

RemoveButton.propTypes = {
  onRemove: PropTypes.func.isRequired,
  fieldIndex: PropTypes.number.isRequired,
  absoluteTopRight: PropTypes.bool,
};

RemoveButton.defaultProps = {
  absoluteTopRight: false,
};

export default RemoveButton;
