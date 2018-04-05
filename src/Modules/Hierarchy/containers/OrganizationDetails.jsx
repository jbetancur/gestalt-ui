import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { Col, Row } from 'react-flexybox';
import { UnixVariablesListing } from 'Modules/Variables';
import { DeleteIcon, EntitlementIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';
import { getParentFQON } from 'util/helpers/strings';
import ResourceProperties from './ResourceProperties';
import withHierarchy from '../withHierarchy';

class OrganizationDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    organizationSet: PropTypes.object.isRequired,
    organizationSetPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    deleteOrg: PropTypes.func.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { organizationSet, match, entitlementActions } = this.props;

    const name = organizationSet.description || organizationSet.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, null, null, 'Organization');
  }

  delete = (e) => {
    e.stopPropagation();
    const { history, organizationSet, deleteOrg, hierarchyActions } = this.props;
    const name = organizationSet.description || organizationSet.name;
    const parentFQON = getParentFQON(organizationSet);
    const onSuccess = () => history.replace(`/${parentFQON}/hierarchy`);

    hierarchyActions.confirmDelete(() => {
      deleteOrg(organizationSet.properties.fqon, onSuccess);
    }, name, 'Organization');
  }

  render() {
    const { match, organizationSet, organizationSetPending, self } = this.props;
    const deleteDisabled = organizationSetPending || (match.params.fqon === self.properties.gestalt_home || match.params.fqon === 'root');

    return [
      <Row key="hierarchy-details">
        <Col flex={6} xs={12}>
          <ResourceProperties model={organizationSet} isOrganization />
        </Col>
        <Col flex={6} xs={12}>
          <UnixVariablesListing envMap={organizationSet.properties.env} />
        </Col>
      </Row>,
      <Div key="hierarchy-details--actions" disabled={organizationSetPending} textAlign="right">
        <Row>
          <Col flex={12}>
            <Button
              disabled={deleteDisabled}
              flat
              iconChildren={<DeleteIcon />}
              onClick={this.delete}
            >
              Delete
            </Button>
            <Button
              flat
              iconChildren="edit"
              component={Link}
              to={{ pathname: `/${organizationSet.properties.fqon}/editOrganization`, state: { modal: true } }}
            >
              Edit
            </Button>
            <Button
              flat
              iconChildren={<EntitlementIcon size={20} />}
              onClick={this.showEntitlements}
            >
              Entitlements
            </Button>
          </Col>
        </Row>
      </Div>,
    ];
  }
}

export default compose(
  withMetaResource,
  withHierarchy,
  withEntitlements,
)(OrganizationDetails);

