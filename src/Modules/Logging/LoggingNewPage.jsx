import React from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import Logging from './Logging';

const LogNewPage = ({ location }) => {
  const query = parse(location.search);

  return (
    <Logging
      name={query.name}
      logType={query.logType}
      logId={query.logId}
      providerType={query.providerType}
      providerId={query.providerId}
      fqon={query.fqon}
      fullPage
    />
  );
};

LogNewPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default LogNewPage;
