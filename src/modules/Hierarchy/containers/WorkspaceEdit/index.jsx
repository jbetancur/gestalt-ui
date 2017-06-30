import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import { map } from 'lodash';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import HierarchyForm from '../../components/HierarchyForm';
import validate from '../../components/HierarchyForm/validations';
import actions from '../../actions';

class WorkspaceEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    updateWorkspace: PropTypes.func.isRequired,
    workspacePending: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    this.props.fetchWorkspace(this.props.match.params.fqon, this.props.match.params.workspaceId);
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
    const { match, history } = this.props;
    const { id } = this.props.workspace;
    const updatedModel = this.updatedModel(values);
    const originalModel = this.originalModel(this.props.workspace);
    const patches = jsonPatch.compare(originalModel, updatedModel);

    const onSuccess = () => history.goBack();
    this.props.updateWorkspace(match.params.fqon, id, patches, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title={this.props.workspace.description || this.props.workspace.nam}
        submitLabel="Update"
        cancelLabel="Back"
        onSubmit={values => this.updateWorkspace(values)}
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
  const variables = map(workspace.properties.env, (value, name) => ({ name, value }));

  return {
    initialValues: {
      name: workspace.name,
      description: workspace.description,
      properties: workspace.properties,
      variables,
    },
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'workspaceEdit',
  validate
})(context(WorkspaceEdit))));
