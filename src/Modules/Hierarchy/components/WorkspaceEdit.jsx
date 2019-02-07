import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ActivityContainer } from 'components/ProgressIndicators';
import HierarchyForm from './HierarchyForm';
import validate from '../validations';
import { generateWorkspacePatches } from '../payloadTransformer';
import { getEditWorkspaceModel } from '../reducers/selectors';
import withContext from '../hocs/withContext';

class WorkspaceEdit extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, hierarchyContextActions } = this.props;

    hierarchyContextActions.fetchWorkspace({ fqon: match.params.fqon, id: match.params.workspaceId });
  }

  componentWillUnmount() {
    const { hierarchyContextActions } = this.props;

    hierarchyContextActions.unloadWorkspace();
  }

  update = (values) => {
    const {
      history,
      location,
      hierarchyContextActions,
      hierarchyContext: { selectedWorkspace },
    } = this.props;

    const payload = generateWorkspacePatches(selectedWorkspace, values);
    const onSuccess = () => {
      if (!location.state.card) {
        history.replace(`/${selectedWorkspace.org.properties.fqon}/hierarchy/${selectedWorkspace.id}/environments`);
      } else {
        history.replace(`/${selectedWorkspace.org.properties.fqon}/hierarchy`);
      }
    };

    hierarchyContextActions.updateWorkspace({ fqon: selectedWorkspace.org.properties.fqon, id: selectedWorkspace.id, payload, onSuccess });
  }

  render() {
    const { hierarchyContext: { selectedWorkspace, selectedWorkspacePending }, initialFormValues } = this.props;

    if (selectedWorkspacePending) {
      return <ActivityContainer centered id="workspace-edit--loading" />;
    }
    return (
      <Form
        component={HierarchyForm}
        title={selectedWorkspace.description || selectedWorkspace.name}
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
  withContext(),
  connect(mapStateToProps),
)(WorkspaceEdit);
