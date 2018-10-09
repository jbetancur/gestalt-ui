import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { FontIcon } from 'react-md';
import statusMap from './statusMap';

const ContainerStatusStyle = styled.div`
  display: flex;
  align-items: center;
  min-width: 115px;
  max-width: 130px;
  font-weight: 400;
  font-size: 11px;
  text-transform: uppercase;
  color: ${props => props.theme.colors[props.color]};

  svg {
    fill: ${props => props.theme.colors[props.color]};
  }

  span {
    margin-left: 8px;
  }
`;

const IconStyle = styled(FontIcon)`
  ${props => `color: ${props.theme.colors[props.color]} !important`};
`;

const ContainerStatus = ({ status }) => {
  const style = statusMap(status);

  return (
    <ContainerStatusStyle color={style.color}>
      <IconStyle color={style.color}>{style.icon}</IconStyle>
      <span>{status.toUpperCase()}</span>
    </ContainerStatusStyle>
  );
};

ContainerStatus.propTypes = {
  status: PropTypes.string,
};

ContainerStatus.defaultProps = {
  status: 'PENDING',
};

export default withTheme(ContainerStatus);
