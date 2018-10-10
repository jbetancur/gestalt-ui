import React from 'react';
import PropTypes from 'prop-types';
import { DockerIcon, MesosIcon, KubernetesIcon, ECSIcon } from 'components/Icons';

const iconTypes = {
  DCOS: <MesosIcon />,
  Kubernetes: <KubernetesIcon />,
  Docker: <DockerIcon />,
  ECS: <ECSIcon />,
  Default: <div />,
};

const ContainerIcon = (props) => {
  const icon = iconTypes[props.resourceType];
  if (!icon) {
    return <span />;
  }

  return icon;
};

ContainerIcon.propTypes = {
  resourceType: PropTypes.string,
};

ContainerIcon.defaultProps = {
  resourceType: 'Default',
};

export default ContainerIcon;
