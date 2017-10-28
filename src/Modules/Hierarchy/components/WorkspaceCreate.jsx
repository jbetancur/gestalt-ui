import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from './HierarchyForm';
import validate from '../validations';
import { generateWorkspacePayload } from '../payloadTransformer';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createWorkspace: PropTypes.func.isRequired,
    workspacePending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  create(values) {
    const { match, history, createWorkspace } = this.props;
    const payload = generateWorkspacePayload(values);
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);

    createWorkspace(match.params.fqon, payload, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title="Create Workspace"
        submitLabel="Create"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.create(values)}
        pending={this.props.workspacePending}
        {...this.props}
      />
    );
  }
}

export default compose(
  withMetaResource,
  withContext,
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
