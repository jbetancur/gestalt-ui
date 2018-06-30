import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateWorkspacePayload } from '../payloadTransformer';

const initialFormValues = metaModels.workspace.get();

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createWorkspace: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    workspacePending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, createWorkspace, fetchOrgSet } = this.props;
    const payload = generateWorkspacePayload(values);
    const onSuccess = () => {
      fetchOrgSet(match.params.fqon);
      history.replace(`/${match.params.fqon}/hierarchy`);
    };
    createWorkspace(match.params.fqon, payload, onSuccess);
  }

  render() {
    const { workspacePending } = this.props;

    return (
      <Form
        component={HierarchyForm}
        title="Create a Workspace"
        loading={workspacePending}
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
