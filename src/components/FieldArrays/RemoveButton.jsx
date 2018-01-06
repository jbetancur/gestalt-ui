import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';

const ButtonStyle = styled(({ theme, ...rest }) => <Button {...rest} />)`
  color: ${props => props.theme.colors['$md-red-500']};
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99;
`;

const RemoveButton = (props) => {
  const handleRemove = () => props.onRemove(props.index);

  return <ButtonStyle icon onClick={handleRemove} {...props}>delete</ButtonStyle>;
};

RemoveButton.propTypes = {
  onRemove: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default withTheme(RemoveButton);
