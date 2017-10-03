import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';

const ContainerStatusStyle = styled.div`
  text-align: center;
  border-radius: 20px;
  padding: 2px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  ${props => props.status === 'RUNNING' && `background-color: ${props.theme.colors['$md-green-a700']}`};
  ${props => props.status === 'LAUNCHED' && `background-color: ${props.theme.colors['$md-blue-500']}`};
  ${props => props.status === 'HEALTHY' && `background-color: ${props.theme.colors['$md-green-a700']}`};
  ${props => props.status === 'UNHEALTHY' && `background-color: ${props.theme.colors['$md-orange-a400']}`};
  ${props => props.status === 'SCALING' && `background-color: ${props.theme.colors['$md-blue-500']}`};
  ${props => props.status === 'SUSPENDED' && `background-color: ${props.theme.colors['$md-orange-a400']}`};
  ${props => props.status === 'LOST' && `background-color: ${props.theme.colors['$md-red-a400']}`};
  ${props => props.status === 'ERROR' && `background-color: ${props.theme.colors['$md-red-a400']}`};

  i {
    margin-left: -27px;
    color: white;
  }

  span {
    line-height: 19px;
    margin-left: 16px;
  }
`;

const ContainerStatus = (props) => {
  const setIcon = () => {
    switch (props.status) {
      case 'RUNNING':
        return 'check_circle';
      case 'LAUNCHED':
        return 'info';
      case 'HEALTHY':
        return 'check_circle';
      case 'UNHEALTHY':
        return 'error_outline';
      case 'SCALING':
        return 'access_time';
      case 'SUSPENDED':
        return 'info';
      case 'LOST':
        return 'new_releases';
      case 'ERROR':
        return 'new_releases';
      default:
        return 'info';
    }
  };

  return (
    <ContainerStatusStyle status={props.status}>
      <FontIcon>{setIcon()}</FontIcon><span>{props.status}</span>
    </ContainerStatusStyle>
  );
};

ContainerStatus.propTypes = {
  status: PropTypes.string,
};

ContainerStatus.defaultProps = {
  status: '',
};

export default ContainerStatus;
