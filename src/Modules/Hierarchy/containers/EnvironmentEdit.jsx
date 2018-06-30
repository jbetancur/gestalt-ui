import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withMetaResource } from 'Modules/MetaResource';
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
    fetchEnvironment: PropTypes.func.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    updateEnvironment: PropTypes.func.isRequired,
    environmentPending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match } = this.props;

    this.props.fetchEnvironment(match.params.fqon, match.params.environmentId);
  }

  update = (values) => {
    const { match, history, location, environment, updateEnvironment, fetchEnvironments } = this.props;
    const patches = generateEnvironmentPatches(environment, values);
    const onSuccess = () => {
      if (location.state.card) {
        // note that if the match.params.workspaceId dosnt exist (and it will not in the heirarchy views) the call for re-pop will be made against /fqon/environments
        fetchEnvironments(match.params.fqon, match.params.workspaceId);
      }

      history.goBack();
    };

    updateEnvironment(match.params.fqon, environment.id, patches, onSuccess);
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
  withMetaResource,
  connect(mapStateToProps),
)(EnvironmentEdit);
