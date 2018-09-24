import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { withSelf } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { DeleteIcon, EntitlementIcon, OrganizationIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import withHierarchy from '../hocs/withHierarchy';
import withContext from '../hocs/withContext';

class OrganizationDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { context: { organization }, match, entitlementActions } = this.props;

    const name = organization.description || organization.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, null, null, 'Organization');
  }

  delete = (e) => {
    e.stopPropagation();
    const { context: { organization }, history, contextActions, hierarchyActions } = this.props;
    const name = organization.description || organization.name;
    const onSuccess = () => history.replace(`/${organization.org.properties.fqon}/hierarchy`);

    hierarchyActions.confirmDelete(({ force }) => {
      contextActions.deleteOrg({ fqon: organization.properties.fqon, resource: organization, onSuccess, params: { force } });
    }, name, 'Organization');
  }

  renderActions() {
    const { context: { organization }, match, self } = this.props;
    const deleteDisabled = match.params.fqon === self.properties.gestalt_home || match.params.fqon === 'root';

    return (
      <React.Fragment>
        <Button
          flat
          iconChildren={<DeleteIcon />}
          onClick={this.delete}
          disabled={deleteDisabled}
        >
          Delete
        </Button>
        <Button
          flat
          iconChildren="edit"
          component={Link}
          to={{ pathname: `/${organization.properties.fqon}/editOrganization`, state: { modal: true } }}
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
      </React.Fragment>
    );
  }

  render() {
    const { context: { organization } } = this.props;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={organization.description || organization.name}
          subtitle={`FQON: ${organization.properties.fqon}`}
          titleIcon={<OrganizationIcon />}
          actions={this.renderActions()}
        />
        <DetailsPane model={organization} />
      </React.Fragment>
    );
  }
}

export default compose(
  withSelf,
  withContext(),
  withHierarchy,
  withEntitlements,
)(OrganizationDetails);
