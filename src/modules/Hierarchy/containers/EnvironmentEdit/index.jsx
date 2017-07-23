import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import { cloneDeep } from 'lodash';
import { arrayToMap, mapTo2DArray } from 'util/helpers/transformations';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import HierarchyForm from '../../components/HierarchyForm';
import validate from '../../components/HierarchyForm/validations';
import actions from '../../actions';

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

  updatedModel(formValues) {
    const { name, description, properties } = cloneDeep(formValues);
    const model = {
      name,
      description,
      properties: {
        environment_type: properties.environment_type,
        env: arrayToMap(properties.env, 'name', 'value'),
      }
    };

    return model;
  }

  originalModel(payload) {
    const { name, description, properties: { environment_type } } = cloneDeep(payload);

    return {
      name,
      description,
      properties: {
        environment_type,
        env: arrayToMap(mapTo2DArray(payload.properties.env), 'name', 'value'),
      }
    };
  }

  updateEnvironment(values) {
    const { history } = this.props;
    const { id } = this.props.environment;
    const updatedModel = this.updatedModel(values);
    const originalModel = this.originalModel(this.props.environment);
    const patches = jsonPatch.compare(originalModel, updatedModel);

    const onSuccess = () => history.goBack();
    this.props.updateEnvironment(this.props.match.params.fqon, id, patches, onSuccess);
  }

  render() {
    const { environment } = this.props;

    return (
      <HierarchyForm
        title={environment.description || environment.name}
        submitLabel="Update"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.updateEnvironment(values)}
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
