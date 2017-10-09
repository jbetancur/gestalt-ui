import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { mapTo2DArray } from 'util/helpers/transformations';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../components/HierarchyForm/validations';
import actions from '../actions';
import { generateEnvironmentPatches } from '../payloadTransformer';

class EnvironmentEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    updateEnvironment: PropTypes.func.isRequired,
    environmentPending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    const { match } = this.props;
    this.props.fetchEnvironment(match.params.fqon, match.params.environmentId);
  }

  update(values) {
    const { match, history, environment, updateEnvironment } = this.props;
    const patches = generateEnvironmentPatches(environment, values);
    const onSuccess = () => history.goBack();

    updateEnvironment(match.params.fqon, environment.id, patches, onSuccess);
  }

  render() {
    const { environment } = this.props;

    return (
      <HierarchyForm
        title={environment.description || environment.name}
        submitLabel="Update"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.update(values)}
        envMap={environment.properties.env}
        isEnvironment
        editMode
        pending={this.props.environmentPending}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { environment } = state.metaResource.environment;

  return {
    initialValues: {
      name: environment.name,
      description: environment.description,
      properties: {
        ...environment.properties,
        env: mapTo2DArray(environment.properties.env),
      },
    },
    enableReinitialize: true
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'environmentEdit',
  validate
})(withContext(EnvironmentEdit))));
