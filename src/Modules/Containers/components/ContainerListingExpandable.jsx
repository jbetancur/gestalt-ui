import React from 'react';
import { withRouter } from 'react-router-dom';
import ContainerInstances from '../components/ContainerInstances';

const ContainerListingExpandable = ({ data, match }) => (
  <ContainerInstances
    instances={data.properties.instances}
    fqon={match.params.fqon}
    containerModel={data}
  />
);

export default withRouter(ContainerListingExpandable);
