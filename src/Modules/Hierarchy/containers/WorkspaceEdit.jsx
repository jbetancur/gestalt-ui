import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withMetaResource, withWorkspace } from 'Modules/MetaResource';
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
    workspacePending: PropTypes.bool.isRequired,
    workspaceActions: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, workspaceActions } = this.props;

    workspaceActions.fetchWorkspace({ fqon: match.params.fqon, id: match.params.workspaceId });
  }

  update = (values) => {
    const {
      match,
      history,
      location,
      workspace,
      workspaceActions,
      fetchOrgSet,
    } = this.props;

    const payload = generateWorkspacePatches(workspace, values);
    const onSuccess = () => {
      if (location.state.card) {
        fetchOrgSet(match.params.fqon);
      }

      history.goBack();
    };

    workspaceActions.updateWorkspace({ fqon: match.params.fqon, id: workspace.id, payload, onSuccess });
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
  withWorkspace(),
  connect(mapStateToProps),
)(WorkspaceEdit);
