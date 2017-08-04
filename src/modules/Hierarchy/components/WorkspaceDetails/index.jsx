import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { VariablesListing } from 'modules/Variables';

const WorkspaceDetails = (props) => {
  const { workspace } = props;

  return (
    <div className="flex-row">
      <div className="flex-6 flex-xs-12">
        <div><span className="gf-label">Name: </span><span className="gf-subtitle">{workspace.description || workspace.name}</span></div>
        <div><span className="gf-label">short-name: </span><span className="gf-subtitle">{workspace.name}</span></div>
        <div><span className="gf-label">Created: </span><span className="gf-subtitle"><FormattedRelative value={workspace.created.timestamp} /> (<FormattedDate value={workspace.created.timestamp} /> <FormattedTime value={workspace.created.timestamp} />)</span></div>
        <div><span className="gf-label">Modified: </span><span className="gf-subtitle"><FormattedRelative value={workspace.modified.timestamp} /> (<FormattedDate value={workspace.modified.timestamp} /> <FormattedTime value={workspace.modified.timestamp} />)</span></div>
        <div><span className="gf-label">Owner: </span><span className="gf-subtitle">{workspace.owner.name}</span></div>
        <div><span className="gf-label">uuid: </span><span className="gf-subtitle">{workspace.id}</span></div>
      </div>
      <div className="flex-6 flex-xs-12">
        <fieldset>
          <legend>Environment Variables</legend>
          <div style={{ maxHeight: '16em', overflow: 'scroll' }}>
            <VariablesListing envMap={workspace.properties.env} />
          </div>
        </fieldset>
      </div>
    </div>
  );
};

WorkspaceDetails.propTypes = {
  workspace: PropTypes.object.isRequired,
  // t: PropTypes.func.isRequired,
};

export default WorkspaceDetails;
