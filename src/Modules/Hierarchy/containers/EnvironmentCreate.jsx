import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ActivityContainer } from 'components/ProgressIndicators';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateEnvironmentPayload } from '../payloadTransformer';
import environmentModel from '../models/environment';
import withContext from '../hocs/withContext';

const initialFormValues = environmentModel.get();

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    selectedEnvironmentPending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, contextActions } = this.props;
    const payload = generateEnvironmentPayload(values);
    const onSuccess = (response) => {
      // contextActions.fetchEnvironments({ fqon: match.params.fqon, entityId: response.properties.workspace.id });
      history.replace(`/${match.params.fqon}/hierarchy/${response.properties.workspace.id}/environments`);
    };

    contextActions.createEnvironment({ fqon: match.params.fqon, entityId: match.params.workspaceId, entityKey: 'workspaces', payload, onSuccess });
  }

  render() {
    const { selectedEnvironmentPending } = this.props;

    return (
      selectedEnvironmentPending
        ?
          <ActivityContainer centered id="environment-create--loading" />
        :
          <Form
            component={HierarchyForm}
            title="Create an Environment"
            isEnvironment
            onSubmit={this.create}
            initialValues={initialFormValues}
            validate={validate(true)}
            mutators={{ ...arrayMutators }}
          />
    );
  }
}

export default compose(
  withContext(),
)(OrgCreate);
