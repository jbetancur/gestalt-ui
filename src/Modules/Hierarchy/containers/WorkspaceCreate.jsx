import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withMetaResource, withWorkspace, withOrganization } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateWorkspacePayload } from '../payloadTransformer';
import workspaceModel from '../models/workspace';

const initialFormValues = workspaceModel.get();

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    organizationActions: PropTypes.object.isRequired,
    workspaceActions: PropTypes.object.isRequired,
    workspacePending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, workspaceActions, organizationActions } = this.props;
    const payload = generateWorkspacePayload(values);
    const onSuccess = () => {
      organizationActions.fetchOrgSet({ fqon: match.params.fqon });
      history.replace(`/${match.params.fqon}/hierarchy`);
    };

    workspaceActions.createWorkspace({ fqon: match.params.fqon, payload, onSuccess });
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
        validate={validate()}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

export default compose(
  withMetaResource,
  withWorkspace(),
  withOrganization(),
)(OrgCreate);
