import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateWorkspacePayload } from '../payloadTransformer';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createWorkspace: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    workspacePending: PropTypes.bool.isRequired,
  };

  create(values) {
    const { match, history, createWorkspace, fetchOrgSet } = this.props;
    const payload = generateWorkspacePayload(values);
    const onSuccess = () => {
      fetchOrgSet(match.params.fqon);
      history.replace(`/${match.params.fqon}/hierarchy`);
    };
    createWorkspace(match.params.fqon, payload, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title="Create Workspace"
        submitLabel="Create"
        cancelLabel="Cancel"
        onSubmit={values => this.create(values)}
        pending={this.props.workspacePending}
        {...this.props}
      />
    );
  }
}

export default compose(
  withMetaResource,
  reduxForm({
    form: 'workspaceCreate',
    initialValues: {
      ...metaModels.workspace,
      properties: {
        env: [],
      }
    },
    validate,
  })
)(OrgCreate);
