import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import map from 'lodash/map';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import { metaActions } from 'modules/MetaResource';
import * as actions from '../../actions';

class WorkspaceEdit extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    updateWorkspace: PropTypes.func.isRequired,
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
      model.properties.env[variable.name] = variable.value;
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
    const { params, router } = this.props;
    const { id } = this.props.workspace;
    const updatedModel = this.updatedModel(values);
    const originalModel = this.originalModel(this.props.workspace);
    const patches = jsonPatch.compare(originalModel, updatedModel);

    const onSuccess = () => router.push(`${params.fqon}/workspaces/${id}`);
    this.props.updateWorkspace(params.fqon, id, patches, onSuccess);
  }

  render() {
    return (
      <ContainmentForm
        title={this.props.workspace.description || this.props.workspace.nam}
        submitLabel="Update" cancelLabel="Cancel"
        onSubmit={values => this.updateWorkspace(values)}
        envMap={this.props.workspace.properties.env}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { workspace, pending } = state.metaResource.workspace;
  const variables = map(workspace.properties.env, (value, name) => ({ name, value }));

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

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'workspaceEdit',
  validate
})(WorkspaceEdit));
