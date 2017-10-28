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

class WorkspaceDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    workspacePending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    deleteWorkspace: PropTypes.func.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
  };

  delete = () => {
    const { match, history, workspace, deleteWorkspace, hierarchyActions } = this.props;
    const name = workspace.description || workspace.name;
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);

    hierarchyActions.confirmDelete(() => {
      deleteWorkspace(match.params.fqon, workspace.id, onSuccess);
    }, name, 'Workspace');
  }
  render() {
    const { match, workspace, workspacePending } = this.props;

    return [
      <Row key="workspace-details">
        <Col flex={6} xs={12}>
          <ResourceProperties model={workspace} />
        </Col>
        <Col flex={6} xs={12}>
          <VariablesListing envMap={workspace.properties.env} />
        </Col>
      </Row>,
      <Div key="workspace-details--actions" disabled={workspacePending} textAlign="right">
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
              to={`${match.url}/edit`}
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
)(WorkspaceDetails);

