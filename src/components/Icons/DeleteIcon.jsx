import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/DeleteOutline';

const DeleteOutlineIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px !important`};
  color: ${props => `${props.color}`};
`;

const DeleteOutlineIcon = ({ size, color, ...rest }) => <DeleteOutlineIconStyle size={size} color={color} {...rest} />;

DeleteOutlineIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

DeleteOutlineIcon.defaultProps = {
  size: 24,
  color: 'action',
};

export default DeleteOutlineIcon;
