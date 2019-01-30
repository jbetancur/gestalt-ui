import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ActivityContainer } from 'components/ProgressIndicators';
import HierarchyForm from './HierarchyForm';
import validate from '../validations';
import { generateWorkspacePayload } from '../payloadTransformer';
import workspaceModel from '../models/workspace';
import withContext from '../hocs/withContext';

const initialFormValues = workspaceModel.get();

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
  };

  create = (values) => {
    const { match, history, hierarchyContextActions } = this.props;
    const payload = generateWorkspacePayload(values);
    const onSuccess = () => {
      history.replace(`/${match.params.fqon}/hierarchy`);
    };

    hierarchyContextActions.createWorkspace({ fqon: match.params.fqon, payload, onSuccess });
  }

  render() {
    const { hierarchyContext: { selectedWorkspacePending } } = this.props;

    if (selectedWorkspacePending) {
      return <ActivityContainer centered id="workspace-create--loading" />;
    }

    return (
      <Form
        component={HierarchyForm}
        title="Create a Workspace"
        onSubmit={this.create}
        initialValues={initialFormValues}
        validate={validate()}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

export default compose(
  withContext(),
)(OrgCreate);
