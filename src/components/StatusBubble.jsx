import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';

const ContainerStatusStyle = styled.div`
  text-align: left;
  min-width: 115px;
  max-width: 130px;
  border-radius: 20px;
  padding: 2px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  ${props => props.status === 'RUNNING' && `background-color: ${props.theme.colors['$md-blue-grey-400']}`};
  ${props => props.status === 'HEALTHY' && `background-color: ${props.theme.colors['$md-green-a700']}`};
  ${props => props.status === 'UNHEALTHY' && `background-color: ${props.theme.colors['$md-red-a400']}`};
  ${props => props.status === 'SCALING' && `background-color: ${props.theme.colors['$md-blue-500']}`};
  ${props => props.status === 'SUSPENDED' && `background-color: ${props.theme.colors['$md-orange-500']}`};
  ${props => props.status === 'LOST' && `background-color: ${props.theme.colors['$md-red-a400']}`};
  ${props => props.status === 'ERROR' && `background-color: ${props.theme.colors['$md-red-a400']}`};
  ${props => props.status === 'ACTIVE' && `background-color: ${props.theme.colors['$md-blue-grey-400']}`};
  ${props => props.status === 'FAILED' && `background-color: ${props.theme.colors['$md-red-a400']}`};
  ${props => props.status === 'PENDING' && `background-color: ${props.theme.colors['$md-orange-500']}`};
  ${props => props.status === 'DELETED' && `background-color: ${props.theme.colors['$md-grey-900']}`};
  ${props => props.status === 'DISABLED' && `background-color: ${props.theme.colors['$md-grey-500']}`};
  ${props => props.status === 'LAUNCHED' && `background-color: ${props.theme.colors['$md-grey-300']}`};
  ${props => props.status === 'UNKNOWN' && `background-color: ${props.theme.colors['$md-red-a400']}`};

  i {
    color: white;
    margin-left: 1px;
  }

  span {
    text-align: center;
    line-height: 20px;
    margin-left: 8px;

    @media (min-width: 0) and (max-width: 1025px) {
      line-height: 24px;
    }
  }
`;

const ContainerStatus = (props) => {
  const setIcon = () => {
    switch (props.status.toUpperCase()) {
      case 'RUNNING':
        return 'check_circle';
      case 'HEALTHY':
        return 'check_circle';
      case 'UNHEALTHY':
        return 'new_releases';
      case 'SCALING':
        return 'access_time';
      case 'SUSPENDED':
        return 'info';
      case 'LOST':
        return 'new_releases';
      case 'ERROR':
        return 'new_releases';
      case 'ACTIVE':
        return 'check_circle';
      case 'FAILED':
        return 'new_releases';
      case 'PENDING':
        return 'access_time';
      case 'DELETED':
        return 'clear';
      case 'DISABLED':
        return 'remove_circle';
      case 'UNKNOWN':
        return 'help_outline';
      default:
        return 'info';
    }
  };

  return (
    <ContainerStatusStyle status={props.status.toUpperCase()}>
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
