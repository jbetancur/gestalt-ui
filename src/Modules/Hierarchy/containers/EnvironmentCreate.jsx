import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withEnvironments, withEnvironment, metaModels } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateEnvironmentPayload } from '../payloadTransformer';

const initialFormValues = metaModels.environment.get();

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    environmentActions: PropTypes.object.isRequired,
    environmentsActions: PropTypes.object.isRequired,
    environmentPending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, environmentActions, environmentsActions } = this.props;
    const payload = generateEnvironmentPayload(values);
    const onSuccess = (response) => {
      environmentsActions.fetchEnvironments({ fqon: match.params.fqon, entityId: response.properties.workspace.id });
      history.replace(`/${match.params.fqon}/hierarchy/${response.properties.workspace.id}/environments`);
    };

    environmentActions.createEnvironment({ fqon: match.params.fqon, entityId: match.params.workspaceId, entityKey: 'workspaces', payload, onSuccess });
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
        validate={validate(true)}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

export default compose(
  withEnvironments(),
  withEnvironment(),
)(OrgCreate);
