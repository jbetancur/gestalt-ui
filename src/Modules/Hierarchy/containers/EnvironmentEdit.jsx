import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ActivityContainer } from 'components/ProgressIndicators';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateEnvironmentPatches } from '../payloadTransformer';
import { getEditEnvironmentModel } from '../selectors';
import withContext from '../hocs/withContext';

class EnvironmentEdit extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    selectedEnvironment: PropTypes.object.isRequired,
    selectedEnvironmentPending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, contextActions } = this.props;

    contextActions.fetchEnvironment({ fqon: match.params.fqon, id: match.params.environmentId });
  }


  componentWillUnmount() {
    const { contextActions } = this.props;

    contextActions.unloadEnvironment();
  }

  update = (values) => {
    const { location, history, selectedEnvironment, contextActions } = this.props;
    const payload = generateEnvironmentPatches(selectedEnvironment, values);
    const onSuccess = () => {
      const { id, org, properties } = selectedEnvironment;

      if (!location.state.card) {
        history.replace(`/${org.properties.fqon}/hierarchy/${properties.workspace.id}/environment/${id}`);
      } else {
        history.replace(`/${org.properties.fqon}/hierarchy/${properties.workspace.id}/environments`);
      }
    };

    contextActions.updateEnvironment({ fqon: selectedEnvironment.org.properties.fqon, id: selectedEnvironment.id, payload, onSuccess });
  }

  render() {
    const { selectedEnvironment, selectedEnvironmentPending, initialFormValues } = this.props;

    return (
      selectedEnvironmentPending
        ?
          <ActivityContainer centered id="environment-edit--loading" />
        :
          <Form
            component={HierarchyForm}
            title={selectedEnvironment.description || selectedEnvironment.name}
            loading={selectedEnvironmentPending}
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
  withContext(),
  connect(mapStateToProps),
)(EnvironmentEdit);
