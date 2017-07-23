import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import { arrayToMap, mapTo2DArray } from 'util/helpers/transformations';
import { withContext } from 'modules/ContextManagement';
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
    pristine: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    this.props.fetchWorkspace(this.props.match.params.fqon, this.props.match.params.workspaceId);
  }

  updatedModel(formValues) {
    const { name, description, properties } = formValues;
    const model = {
      name,
      description,
      properties: {
        env: arrayToMap(properties.env, 'name', 'value'),
      },
    };

    return model;
  }

  originalModel(originalOrg) {
    const { name, description, properties } = originalOrg;

    return {
      name,
      description,
      properties: {
        env: arrayToMap(mapTo2DArray(properties.env), 'name', 'value'),
      }
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
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
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
