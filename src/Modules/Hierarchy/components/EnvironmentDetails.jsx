import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { withMetaResource } from 'Modules/MetaResource';
import { Col, Row } from 'react-flexybox';
import { VariablesListing } from 'Modules/Variables';
import { DeleteIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';
import ResourceProperties from './ResourceProperties';
import withHierarchy from '../withHierarchy';

class EnvironmentDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    environmentPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    deleteEnvironment: PropTypes.func.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
  };

  delete = () => {
    const { match, history, environment, deleteEnvironment, hierarchyActions } = this.props;
    const name = environment.description || environment.name;
    const onSuccess = () =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments`);

    hierarchyActions.confirmDelete(() => {
      deleteEnvironment(match.params.fqon, environment.id, onSuccess);
    }, name, 'Environment');
  }

  render() {
    const { match, environment, environmentPending } = this.props;

    return [
      <Row key="environment-details">
        <Col flex={6} xs={12}>
          <ResourceProperties model={environment} isEnvironment />
        </Col>
        <Col flex={6} xs={12}>
          <VariablesListing envMap={environment.properties.env} />
        </Col>
      </Row>,
      <Div key="environment-details--actions" disabled={environmentPending} textAlign="right">
        <Row>
          <Col flex={12}>
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
          </Col>
        </Row>
      </Div>,
    ];
  }
}

export default compose(
  withMetaResource,
  withHierarchy,
)(EnvironmentDetails);
