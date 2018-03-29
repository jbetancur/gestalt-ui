import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ContainerInstances from '../components/ContainerInstances';

const ContainerListingExpandable = ({ data, match }) => (
  <ContainerInstances
    instances={data.properties.instances}
    fqon={match.params.fqon}
    containerModel={data}
  />
);

ContainerListingExpandable.propTypes = {
  data: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(ContainerListingExpandable);
