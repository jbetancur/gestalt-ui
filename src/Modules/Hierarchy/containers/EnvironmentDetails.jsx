import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { withEntitlements } from 'Modules/Entitlements';
import { DeleteIcon, EntitlementIcon, EnvironmentIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import withHierarchy from '../hocs/withHierarchy';
import withContext from '../hocs/withContext';

class EnvironmentDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { context: { environment }, match, entitlementActions } = this.props;

    const name = environment.description || environment.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, environment.id, 'environments', 'Environment');
  }

  delete = () => {
    const { context: { environment }, match, history, contextActions, hierarchyActions } = this.props;
    const name = environment.description || environment.name;
    const onSuccess = () =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments`);

    hierarchyActions.confirmDelete(({ force }) => {
      contextActions.deleteEnvironment({ fqon: match.params.fqon, resource: environment, onSuccess, params: { force } });
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
    const { context: { environment } } = this.props;
    const environmentType = environment.id && environment.properties ? environment.properties.environment_type.toUpperCase() : null;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={environment.description || environment.name}
          titleIcon={<EnvironmentIcon />}
          subtitle={`Environment Type: ${environmentType}`}
          actions={this.renderActions()}
        />
        <DetailsPane model={environment} />
      </React.Fragment>
    );
  }
}

export default compose(
  withContext(),
  withHierarchy,
  withEntitlements,
)(EnvironmentDetails);
