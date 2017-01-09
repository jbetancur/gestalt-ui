import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import _map from 'lodash/map';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import * as actions from '../../actions';

class WorkspaceEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    updateWorkspace: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchWorkspace(this.props.params.fqon, this.props.params.workspaceId);
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
        title={this.props.workspace.name}
        submitLabel="Update" cancelLabel="Cancel"
        onSubmit={values => this.updateWorkspace(values)}
        envMap={this.props.workspace.properties.env}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { item, pending } = state.workspaces.fetchOne;
  const variables = _map(item.properties.env, (value, key) => ({ key, value }));

  return {
    workspace: item,
    pending,
    initialValues: {
      name: item.name,
      description: item.description,
      properties: item.properties,
      variables
    },
    enableReinitialize: true
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'workspaceEdit',
  validate
})(WorkspaceEdit));
