import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withMetaResource } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateWorkspacePatches } from '../payloadTransformer';
import { getEditWorkspaceModel } from '../selectors';

class WorkspaceEdit extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    updateWorkspace: PropTypes.func.isRequired,
    workspacePending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, fetchWorkspace } = this.props;

    fetchWorkspace(match.params.fqon, match.params.workspaceId);
  }

  update = (values) => {
    const {
      match,
      history,
      location,
      workspace,
      updateWorkspace,
      fetchOrgSet,
    } = this.props;

    const patches = generateWorkspacePatches(workspace, values);
    const onSuccess = () => {
      if (location.state.card) {
        fetchOrgSet(match.params.fqon);
      }

      history.goBack();
    };

    updateWorkspace(match.params.fqon, workspace.id, patches, onSuccess);
  }

  render() {
    const { workspace, workspacePending, initialFormValues } = this.props;

    return (
      <Form
        component={HierarchyForm}
        title={workspace.description || workspace.name}
        loading={workspacePending}
        editMode
        onSubmit={this.update}
        initialValues={initialFormValues}
        validate={validate()}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getEditWorkspaceModel(state),
});

export default compose(
  withMetaResource,
  connect(mapStateToProps),
)(WorkspaceEdit);
