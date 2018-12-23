import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ActivityContainer } from 'components/ProgressIndicators';
import HierarchyForm from './HierarchyForm';
import validate from '../validations';
import { generateEnvironmentPayload } from '../payloadTransformer';
import environmentModel from '../models/environment';
import withContext from '../hocs/withContext';

const initialFormValues = environmentModel.get();

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
  };

  create = (values) => {
    const { match, history, hierarchyContextActions } = this.props;
    const payload = generateEnvironmentPayload(values);
    const onSuccess = (response) => {
      // hierarchyContextActions.fetchEnvironments({ fqon: match.params.fqon, entityId: response.properties.workspace.id });
      history.replace(`/${match.params.fqon}/hierarchy/${response.properties.workspace.id}/environments`);
    };

    hierarchyContextActions.createEnvironment({ fqon: match.params.fqon, entityId: match.params.workspaceId, entityKey: 'workspaces', payload, onSuccess });
  }

  render() {
    const { hierarchyContext: { selectedEnvironmentPending } } = this.props;

    if (selectedEnvironmentPending) {
      return <ActivityContainer centered id="environment-create--loading" />;
    }

    return (
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
