import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FlatButton } from 'components/Buttons';
import AddIcon from '@material-ui/icons/Add';

const ButtonStyle = styled(({ absoluteTopRight, ...rest }) => <FlatButton {...rest} />)`
  color: ${props => props.theme.colors['$md-blue-500']};
`;

const AddButton = ({ onClick, label }) => (
  <ButtonStyle
    onClick={onClick}
    label={label}
    icon={<AddIcon />}
    disableRipple
    color="primary"
  />
);

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};

AddButton.defaultProps = {
  label: null,
};

export default AddButton;
