import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import HierarchyForm from '../../components/HierarchyForm';
import validate from '../../components/HierarchyForm/validations';
import actions from '../../actions';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createEnvironment: PropTypes.func.isRequired,
    environmentPending: PropTypes.bool.isRequired,
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
        pending={this.props.environmentPending}
        {...this.props}
      />
    );
  }
}

function mapStateToProps() {
  return {
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

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'environmentCreate',
  validate
})(context(OrgCreate))));
