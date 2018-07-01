import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withEnvironments, withEnvironment } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateEnvironmentPatches } from '../payloadTransformer';
import { getEditEnvironmentModel } from '../selectors';

class EnvironmentEdit extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    environmentPending: PropTypes.bool.isRequired,
    environmentActions: PropTypes.object.isRequired,
    environmentsActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, environmentActions } = this.props;

    environmentActions.fetchEnvironment({ fqon: match.params.fqon, id: match.params.environmentId });
  }

  update = (values) => {
    const { match, history, location, environment, environmentActions, environmentsActions } = this.props;
    const payload = generateEnvironmentPatches(environment, values);
    const onSuccess = () => {
      if (location.state.card) {
        // note that if the match.params.workspaceId dosnt exist (and it will not in the heirarchy views) the call for re-pop will be made against /fqon/environments
        environmentsActions.fetchEnvironments({ fqon: match.params.fqon, entityId: environment.properties.workspace.id });
      }

      history.goBack();
    };

    environmentActions.updateEnvironment({ fqon: match.params.fqon, id: environment.id, payload, onSuccess });
  }

  render() {
    const { environment, environmentPending, initialFormValues } = this.props;

    return (
      <Form
        component={HierarchyForm}
        title={environment.description || environment.name}
        loading={environmentPending}
        editMode
        isEnvironment
        onSubmit={this.update}
        initialValues={initialFormValues}
        validate={validate(true)}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getEditEnvironmentModel(state),
});

export default compose(
  withEnvironments(),
  withEnvironment(),
  connect(mapStateToProps),
)(EnvironmentEdit);
