import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { DeleteIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';

class EnvironmentActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    deleteEnvironment: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    showEntitlementsModal: PropTypes.func.isRequired,
  };

  delete() {
    const { match, history, environment, deleteEnvironment } = this.props;
    const onSuccess = () => history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}`);

    this.props.confirmDelete(() => {
      deleteEnvironment(match.params.fqon, environment.id, onSuccess);
    }, environment.description || environment.name, 'Environment');
  }

  render() {
    const { environment, pending, match } = this.props;
    const name = environment.description || environment.name;

    return (
      <Div display="inline" disabled={pending}>
        <Button
          flat
          label="Edit"
          component={Link}
          to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/edit`}
        >
          edit
        </Button>
        <Button
          flat
          label="Entitlements"
          onClick={() => this.props.showEntitlementsModal(name, match.params, 'Environment')}
        >
          security
        </Button>
        <Button
          flat
          label="Delete"
          onClick={e => this.delete(e)}
        >
          <DeleteIcon />
        </Button>
      </Div>
    );
  }
}

export default EnvironmentActions;
