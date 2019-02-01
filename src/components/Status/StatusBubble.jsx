import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';
import { media } from 'util/helpers/media';
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

  div {
    margin-left: 8px;
    height: 14px;
    ${() => media.xs`
      height: 18px;
    `};
    ${() => media.sm`
      height: 18px;
    `};
  }
`;

const StatusDetail = styled.div`
  display: block;
  padding-top: 6px;
`;

const IconStyle = styled(FontIcon)`
  ${props => `color: ${props.theme.colors[props.color]} !important`};
`;

const ContainerStatus = ({ status, statusDetail }) => {
  const style = statusMap(status);

  return (
    <React.Fragment>
      <ContainerStatusStyle color={style.color}>
        <IconStyle color={style.color}>{style.icon}</IconStyle>
        <div>{status}</div>
      </ContainerStatusStyle>
      {statusDetail.reason && <StatusDetail>{`${statusDetail.stateId}-${statusDetail.reason}`}</StatusDetail>}
    </React.Fragment>
  );
};

ContainerStatus.propTypes = {
  status: PropTypes.string,
  statusDetail: PropTypes.object,
};

ContainerStatus.defaultProps = {
  status: 'PENDING',
  statusDetail: {},
};

export default ContainerStatus;
