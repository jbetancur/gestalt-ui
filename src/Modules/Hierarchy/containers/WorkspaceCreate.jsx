import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ActivityContainer } from 'components/ProgressIndicators';
import { withMetaResource } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateWorkspacePayload } from '../payloadTransformer';
import workspaceModel from '../models/workspace';
import withContext from '../hocs/withContext';

const initialFormValues = workspaceModel.get();

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    selectedWorkspacePending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, contextActions } = this.props;
    const payload = generateWorkspacePayload(values);
    const onSuccess = () => {
      history.replace(`/${match.params.fqon}/hierarchy`);
    };

    contextActions.createWorkspace({ fqon: match.params.fqon, payload, onSuccess });
  }

  render() {
    const { selectedWorkspacePending } = this.props;

    return (
      selectedWorkspacePending
        ?
          <ActivityContainer centered id="workspace-create--loading" />
        :
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
  withMetaResource,
  withContext(),
)(OrgCreate);
