import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { VariablesListing } from 'Modules/Variables';
import Label from 'components/Label';

const WorkspaceDetails = (props) => {
  const { workspace } = props;
  const name = workspace.description || workspace.name;

  return (
    <Row>
      <Col flex={6} xs={12}>
        <div><Label>Name: </Label><span className="gf-subtitle">{name}</span></div>
        <div><Label>short-name: </Label><span className="gf-subtitle">{workspace.name}</span></div>
        <div><Label>Created: </Label><span className="gf-subtitle"><FormattedRelative value={workspace.created.timestamp} /> (<FormattedDate value={workspace.created.timestamp} /> <FormattedTime value={workspace.created.timestamp} />)</span></div>
        <div><Label>Modified: </Label><span className="gf-subtitle"><FormattedRelative value={workspace.modified.timestamp} /> (<FormattedDate value={workspace.modified.timestamp} /> <FormattedTime value={workspace.modified.timestamp} />)</span></div>
        <div><Label>Owner: </Label><span className="gf-subtitle">{workspace.owner.name}</span></div>
        <div><Label>uuid: </Label><span className="gf-subtitle">{workspace.id}</span></div>
      </Col>
      <Col flex={6} xs={12}>
        <VariablesListing envMap={workspace.properties.env} />
      </Col>
    </Row>
  );
};

WorkspaceDetails.propTypes = {
  workspace: PropTypes.object.isRequired,
  // t: PropTypes.func.isRequired,
};

export default WorkspaceDetails;
