import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { mapTo2DArray } from 'util/helpers/transformations';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import actions from '../actions';
import { generateWorkspacePatches } from '../payloadTransformer';

class WorkspaceEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    updateWorkspace: PropTypes.func.isRequired,
    workspacePending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    this.props.fetchWorkspace(this.props.match.params.fqon, this.props.match.params.workspaceId);
  }

  update(values) {
    const { match, history, workspace, updateWorkspace } = this.props;
    const patches = generateWorkspacePatches(workspace, values);
    const onSuccess = () => history.goBack();

    updateWorkspace(match.params.fqon, workspace.id, patches, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title={this.props.workspace.description || this.props.workspace.nam}
        submitLabel="Update"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.update(values)}
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

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'workspaceEdit',
  validate
})(withContext(WorkspaceEdit))));
