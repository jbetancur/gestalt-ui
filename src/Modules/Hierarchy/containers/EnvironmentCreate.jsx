import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateEnvironmentPayload } from '../payloadTransformer';

const initialFormValues = metaModels.environment.get();

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
      <Form
        component={HierarchyForm}
        title="Create an Environment"
        isEnvironment
        loading={this.props.environmentPending}
        onSubmit={this.create}
        initialValues={initialFormValues}
        validate={validate}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

export default compose(
  withMetaResource,
)(OrgCreate);
