import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { VariablesListing } from 'modules/Variables';

const HierarchyDetails = (props) => {
  const { model, t } = props;

  return (
    <div className="flex-row">
      <div className="flex-6 flex-xs-12">
        <div><span className="gf-label">{t('general.nouns.name')}: </span><span className="gf-subtitle">{model.description || model.name}</span></div>
        <div><span className="gf-label">{t('general.nouns.shortName')}: </span><span className="gf-subtitle">{model.name}</span></div>
        <div><span className="gf-label">{t('general.nouns.fqon')}: </span><span className="gf-subtitle">{model.properties.fqon}</span></div>
        <div><span className="gf-label">{t('general.verbs.created')}: </span><span className="gf-subtitle"><FormattedRelative value={model.created.timestamp} /> (<FormattedDate value={model.created.timestamp} /> <FormattedTime value={model.created.timestamp} />)</span></div>
        <div><span className="gf-label">{t('general.verbs.modified')}: </span><span className="gf-subtitle"><FormattedRelative value={model.modified.timestamp} /> (<FormattedDate value={model.modified.timestamp} /> <FormattedTime value={model.modified.timestamp} />)</span></div>
        {/* TODO: https://gitlab.com/galacticfog/gestalt-meta/issues/185 */}
        {model.owner.name && <div><span className="gf-label">Owner: </span><span className="gf-subtitle">{model.owner.name}</span></div>}
        <div><span className="gf-label">{t('general.nouns.uuid')}: </span><span className="gf-subtitle">{model.id}</span></div>
      </div>
      <div className="flex-6 flex-xs-12">
        <fieldset>
          <legend>Environment Variables</legend>
          <div style={{ maxHeight: '16em', overflow: 'scroll' }}>
            <VariablesListing envMap={model.properties.env} />
          </div>
        </fieldset>
      </div>
    </div>
  );
};

HierarchyDetails.propTypes = {
  model: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default HierarchyDetails;
