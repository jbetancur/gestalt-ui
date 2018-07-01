import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { withEnvironment } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { DeleteIcon, EntitlementIcon, EnvironmentIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import withHierarchy from '../withHierarchy';

class EnvironmentDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    environmentActions: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    environmentPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { environment, match, entitlementActions } = this.props;

    const name = environment.description || environment.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, environment.id, 'environments', 'Environment');
  }

  delete = () => {
    const { match, history, environment, environmentActions, hierarchyActions } = this.props;
    const name = environment.description || environment.name;
    const onSuccess = () =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments`);

    hierarchyActions.confirmDelete(() => {
      environmentActions.deleteEnvironment({ fqon: match.params.fqon, id: environment.id, onSuccess, params: { force: true } });
    }, name, 'Environment');
  }

  renderActions() {
    const { match } = this.props;

    return (
      <React.Fragment>
        <Button
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
          to={{ pathname: `${match.url}/edit`, state: { modal: true } }}
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
    const { environment, environmentPending } = this.props;
    const environmentType = environment.id && environment.properties ? environment.properties.environment_type.toUpperCase() : null;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={environment.description || environment.name}
          titleIcon={<EnvironmentIcon />}
          subtitle={`Environment Type: ${environmentType}`}
          actions={this.renderActions()}
          disabled={environmentPending}
        />
        <DetailsPane model={environment} />
      </React.Fragment>
    );
  }
}

export default compose(
  withEnvironment(),
  withHierarchy,
  withEntitlements,
)(EnvironmentDetails);
