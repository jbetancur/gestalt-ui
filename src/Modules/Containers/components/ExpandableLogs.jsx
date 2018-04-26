import React from 'react';
import PropTypes from 'prop-types';
import { Logging } from 'Modules/Logging';

const ContainerExpandableLogs = ({ data, containerModel, providerType, fqon }) => (
  <Logging
    showTitle={false}
    name={data.ipAddresses[0].ipAddress}
    logType="container"
    logId={data.id}
    providerType={providerType}
    providerId={containerModel.properties.provider.id}
    fqon={fqon}
  />
);

ContainerExpandableLogs.propTypes = {
  data: PropTypes.object.isRequired,
  containerModel: PropTypes.object.isRequired,
  providerType: PropTypes.string.isRequired,
  fqon: PropTypes.object.isRequired,
};

export default ContainerExpandableLogs;
