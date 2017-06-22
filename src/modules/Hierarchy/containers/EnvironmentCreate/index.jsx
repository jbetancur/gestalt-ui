import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import { HierarchyForm, validate } from 'modules/Hierarchy/components/HierarchyForm';
import actions from '../../actions';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createEnvironment: PropTypes.func.isRequired
  };

  createEnvironment(values) {
    const { match, history } = this.props;
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
        payload.properties.env[variable.name] = variable.value;
      });
    }

    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${response.properties.workspace.id}/environments/${response.id}`);
    this.props.createEnvironment(this.props.match.params.fqon, this.props.match.params.workspaceId, payload, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title="Create Environment"
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
  const { environment, pending } = state.metaResource.environment;
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

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'environmentCreate',
  validate
})(context(OrgCreate)));
