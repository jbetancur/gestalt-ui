import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import getParentFQON from 'util/helpers/fqon';
import { VariablesListing } from 'modules/Variables';
import { DetailCard, DetailCardTitle, DetailCardText } from 'components/DetailCard';
import DotActivity from 'components/DotActivity';
import { NavUpArrowButton } from 'components/Buttons';
import Breadcrumbs from 'modules/Breadcrumbs';
import HierarchyActions from '../../components/HierarchyActions';

class HierarchyDetail extends PureComponent {
  static propTypes = {
    params: PropTypes.object.isRequired,
    pendingOrgset: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { view: 'hierarchy', index: 0 };
  }

  render() {
    const { params, model, pendingOrgset, self, t } = this.props;
    const parentFQON = getParentFQON(model);

    return (
      <div>
        <DetailCard expanderTooltipLabel="Details">
          <DetailCardTitle
            expander={!pendingOrgset}
            title={
              !(params.fqon === self.properties.gestalt_home.properties.fqon) &&
              <NavUpArrowButton disabled={pendingOrgset} component={Link} to={`/${parentFQON}/hierarchy`} />
            }
          >
            <HierarchyActions organization={model} {...this.props} />
            <div>
              <div className="gf-headline">{!pendingOrgset ? <div className="gf-headline">{model.description || model.name}</div> : <DotActivity />}</div>
              <div className="md-caption"><Breadcrumbs /></div>
            </div>
          </DetailCardTitle>
          <DetailCardText expandable>
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
                  <legend>Variables</legend>
                  <VariablesListing envMap={model.properties.env} />
                </fieldset>
              </div>
            </div>
          </DetailCardText>
        </DetailCard>
      </div>
    );
  }
}

export default HierarchyDetail;
