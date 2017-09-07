import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { VariablesListing } from 'modules/Variables';
import Label from 'components/Label';

const EnvironmentDetails = (props) => {
  const { environment } = props;

  return (
    <Row>
      <Col flex={6} xs={12}>
        <div><Label>Name: </Label><span className="gf-subtitle">{name}</span></div>
        <div><Label>short-name: </Label><span className="gf-subtitle">{environment.name}</span></div>
        <div><Label>Created: </Label><span className="gf-subtitle"><FormattedRelative value={environment.created.timestamp} /> (<FormattedDate value={environment.created.timestamp} /> <FormattedTime value={environment.created.timestamp} />)</span></div>
        <div><Label>Modified: </Label><span className="gf-subtitle"><FormattedRelative value={environment.modified.timestamp} /> (<FormattedDate value={environment.modified.timestamp} /> <FormattedTime value={environment.modified.timestamp} />)</span></div>
        <div><Label>Environment Type: </Label><span className="gf-subtitle">{environment.properties.environment_type}</span></div>
        <div><Label>Owner: </Label><span className="gf-subtitle">{environment.owner.name}</span></div>
        <div><Label>uuid: </Label><span className="gf-subtitle">{environment.id}</span></div>
      </Col>
      <Col flex={6} xs={12}>
        <VariablesListing envMap={environment.properties.env} />
      </Col>
    </Row>
  );
};

EnvironmentDetails.propTypes = {
  environment: PropTypes.object.isRequired,
  // t: PropTypes.func.isRequired,
};

export default EnvironmentDetails;
