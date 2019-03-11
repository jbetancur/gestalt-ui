import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/Lock';

const SecretIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px`};
  color: ${props => `${props.color}`};
`;

const SecretIcon = ({ size, color, ...rest }) => <SecretIconStyle size={size} color={color} {...rest} />;

SecretIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

SecretIcon.defaultProps = {
  size: 22,
  color: 'action',
};

export default SecretIcon;
