import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { VariablesListing } from 'modules/Variables';

const EnvironmentDetails = (props) => {
  const { environment } = props;

  return (
    <Row>
      <Col flex={6} xs={12}>
        <div><span className="gf-label">Name: </span><span className="gf-subtitle">{name}</span></div>
        <div><span className="gf-label">short-name: </span><span className="gf-subtitle">{environment.name}</span></div>
        <div><span className="gf-label">Created: </span><span className="gf-subtitle"><FormattedRelative value={environment.created.timestamp} /> (<FormattedDate value={environment.created.timestamp} /> <FormattedTime value={environment.created.timestamp} />)</span></div>
        <div><span className="gf-label">Modified: </span><span className="gf-subtitle"><FormattedRelative value={environment.modified.timestamp} /> (<FormattedDate value={environment.modified.timestamp} /> <FormattedTime value={environment.modified.timestamp} />)</span></div>
        <div><span className="gf-label">Environment Type: </span><span className="gf-subtitle">{environment.properties.environment_type}</span></div>
        <div><span className="gf-label">Owner: </span><span className="gf-subtitle">{environment.owner.name}</span></div>
        <div><span className="gf-label">uuid: </span><span className="gf-subtitle">{environment.id}</span></div>
      </Col>
      <Col flex={6} xs={12}>
        <fieldset>
          <legend>Environment Variables</legend>
          <div style={{ maxHeight: '16em', overflow: 'scroll' }}>
            <VariablesListing envMap={environment.properties.env} />
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

EnvironmentDetails.propTypes = {
  environment: PropTypes.object.isRequired,
  // t: PropTypes.func.isRequired,
};

export default EnvironmentDetails;
