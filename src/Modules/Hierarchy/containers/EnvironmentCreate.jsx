import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateEnvironmentPayload } from '../payloadTransformer';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createEnvironment: PropTypes.func.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    environmentPending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, createEnvironment, fetchEnvironments } = this.props;
    const payload = generateEnvironmentPayload(values);
    const onSuccess = (response) => {
      fetchEnvironments(match.params.fqon, response.properties.workspace.id);
      history.replace(`/${match.params.fqon}/hierarchy/${response.properties.workspace.id}/environments`);
    };

    createEnvironment(match.params.fqon, match.params.workspaceId, payload, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title="Create Environment"
        submitLabel="Create"
        cancelLabel="Cancel"
        onSubmit={this.create}
        isEnvironment
        pending={this.props.environmentPending}
        {...this.props}
      />
    );
  }
}

export default compose(
  withMetaResource,
  reduxForm({
    form: 'environmentCreate',
    initialValues: {
      ...metaModels.environment,
      properties: {
        env: [],
      }
    },
    validate
  })
)(OrgCreate);
