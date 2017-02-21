import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import * as actions from '../../actions';

class OrgCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createWorkspace: PropTypes.func.isRequired
  };

  createWorkspace(values) {
    const payload = {
      name: values.name,
      description: values.description,
      properties: {
        env: {}
      }
    };

    if (values.variables) {
      values.variables.forEach((variable) => {
        payload.properties.env[variable.key] = variable.value;
      });
    }

    this.props.createWorkspace(this.props.params.fqon, payload);
  }

  render() {
    return (
      <ContainmentForm
        title={`${this.props.params.fqon} / Create Workspace`}
        submitLabel="Create"
        cancelLabel="Cancel"
        onSubmit={values => this.createWorkspace(values)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { workspace, pending } = state.workspaces.fetchOne;
  return {
    workspace,
    pending,
    initialValues: {
      name: '',
      description: '',
      properties: {
        env: {}
      }
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'workspaceCreate',
  validate
})(OrgCreate));
