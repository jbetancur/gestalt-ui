import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import * as actions from '../../actions';

class OrgCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createEnvironment: PropTypes.func.isRequired
  };

  createEnvironment(values) {
    const payload = {
      name: values.name,
      description: values.description,
      properties: {
        environment_type: values.properties.environment_type,
        env: {}
      }
    };

    if (values.variables) {
      values.variables.forEach((variable) => {
        payload.properties.env[variable.key] = variable.value;
      });
    }

    this.props.createEnvironment(this.props.params.fqon, this.props.params.workspaceId, payload);
  }

  render() {
    const { router: { location } } = this.props;

    return (
      <ContainmentForm
        title={<span>{location.state.workspace.description || location.state.workspace.name} / Create Environment</span>}
        submitLabel="Create"
        cancelLabel="Cancel"
        onSubmit={values => this.createEnvironment(values)}
        isEnvironment
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { environment, pending } = state.environments.fetchOne;
  return {
    environment,
    pending,
    initialValues: {
      name: '',
      description: '',
      properties: {
        environment_type: '',
        env: {}
      }
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'environmentCreate',
  validate
})(OrgCreate));
