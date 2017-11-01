import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withContext } from 'Modules/ContextManagement';
import { reduxForm } from 'redux-form';
import { mapTo2DArray } from 'util/helpers/transformations';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from './HierarchyForm';
import validate from '../validations';
import { generateEnvironmentPatches } from '../payloadTransformer';

class EnvironmentEdit extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    updateEnvironment: PropTypes.func.isRequired,
    environmentPending: PropTypes.bool.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match } = this.props;
    this.props.fetchEnvironment(match.params.fqon, match.params.environmentId);
  }

  update = (values) => {
    const { match, history, location, environment, updateEnvironment, fetchEnvironments, contextManagerActions } = this.props;
    const patches = generateEnvironmentPatches(environment, values);
    const onSuccess = (response) => {
      if (location.state.card) {
        fetchEnvironments(match.params.fqon, response.properties.workspace.id);
      } else {
        contextManagerActions.setCurrentEnvironmentContext(response);
      }
      history.goBack();
    };

    updateEnvironment(match.params.fqon, environment.id, patches, onSuccess);
  }

  render() {
    const { environment } = this.props;

    return (
      <HierarchyForm
        title={environment.description || environment.name}
        submitLabel="Update"
        cancelLabel="Cancel"
        onSubmit={this.update}
        envMap={environment.properties.env}
        isEnvironment
        editMode
        pending={this.props.environmentPending}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { environment } = state.metaResource.environment;

  return {
    initialValues: {
      ...metaModels.environment,
      name: environment.name,
      description: environment.description,
      properties: {
        ...environment.properties,
        env: mapTo2DArray(environment.properties.env),
      },
    },
    enableReinitialize: true
  };
}

export default compose(
  withMetaResource,
  withContext,
  connect(mapStateToProps),
  reduxForm({
    form: 'environmentEdit',
    validate,
  }),
)(EnvironmentEdit);
