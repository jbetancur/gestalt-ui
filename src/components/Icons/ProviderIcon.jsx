import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/SettingsApplications';

const ProviderIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px`};
  color: ${props => `${props.color}`};
`;

const ProviderIcon = ({ size, color, ...rest }) => <ProviderIconStyle size={size} color={color} {...rest} />;

ProviderIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

ProviderIcon.defaultProps = {
  size: 22,
  color: 'action',
};

export default ProviderIcon;
