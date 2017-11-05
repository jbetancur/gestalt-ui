import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { mapTo2DArray } from 'util/helpers/transformations';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateWorkspacePatches } from '../payloadTransformer';

class WorkspaceEdit extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    updateWorkspace: PropTypes.func.isRequired,
    workspacePending: PropTypes.bool.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, fetchWorkspace } = this.props;

    fetchWorkspace(match.params.fqon, match.params.workspaceId);
  }

  update = (values) => {
    const {
      match,
      history,
      location,
      workspace,
      updateWorkspace,
      fetchOrgSet,
    } = this.props;

    const patches = generateWorkspacePatches(workspace, values);
    const onSuccess = () => {
      if (location.state.card) {
        fetchOrgSet(match.params.fqon);
      }

      history.goBack();
    };

    updateWorkspace(match.params.fqon, workspace.id, patches, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title={this.props.workspace.description || this.props.workspace.nam}
        submitLabel="Update"
        cancelLabel="Cancel"
        onSubmit={this.update}
        envMap={this.props.workspace.properties.env}
        editMode
        pending={this.props.workspacePending}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { workspace } = state.metaResource.workspace;

  return {
    initialValues: {
      ...metaModels.workspace,
      name: workspace.name,
      description: workspace.description,
      properties: {
        ...workspace.properties,
        env: mapTo2DArray(workspace.properties.env),
      },
    },
    enableReinitialize: true,
  };
}

export default compose(
  withMetaResource,
  connect(mapStateToProps),
  reduxForm({
    form: 'workspaceEdit',
    validate
  })
)(WorkspaceEdit);
