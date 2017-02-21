import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import map from 'lodash/map';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import * as actions from '../../actions';

class WorkspaceEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    updateWorkspace: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.fetchWorkspace(this.props.params.fqon, this.props.params.workspaceId);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  updatedModel(formValues) {
    const { name, description } = formValues;
    const model = {
      name,
      description,
      properties: { env: {} }
    };

    // variables is a used for tracking out FieldArray
    formValues.variables.forEach((variable) => {
      model.properties.env[variable.key] = variable.value;
    });

    return model;
  }

  originalModel(originalOrg) {
    const { name, description, properties } = originalOrg;
    const { env } = properties;

    return {
      name,
      description,
      properties: { env }
    };
  }

  updateWorkspace(values) {
    const { id } = this.props.workspace;
    const updatedModel = this.updatedModel(values);
    const originalModel = this.originalModel(this.props.workspace);
    const patches = jsonPatch.compare(originalModel, updatedModel);

    this.props.updateWorkspace(this.props.params.fqon, id, patches);
  }

  render() {
    return (
      <ContainmentForm
        title={this.props.workspace.description || this.props.workspace.name}
        submitLabel="Update" cancelLabel="Cancel"
        onSubmit={values => this.updateWorkspace(values)}
        envMap={this.props.workspace.properties.env}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { workspace, pending } = state.workspaces.fetchOne;
  const variables = map(workspace.properties.env, (value, key) => ({ key, value }));

  return {
    workspace,
    pending,
    initialValues: {
      name: workspace.name,
      description: workspace.description,
      properties: workspace.properties,
      variables,
    },
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'workspaceEdit',
  validate
})(WorkspaceEdit));
