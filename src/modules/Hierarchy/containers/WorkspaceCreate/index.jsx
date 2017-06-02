import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import { ContainmentForm, validate } from '../../components/ContainmentForm';
import * as actions from '../../actions';

class OrgCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createWorkspace: PropTypes.func.isRequired,
  };

  createWorkspace(values) {
    const { params, router } = this.props;

    const payload = {
      name: values.name,
      description: values.description,
      properties: {
        env: {},
      },
    };

    if (values.variables) {
      values.variables.forEach((variable) => {
        payload.properties.env[variable.name] = variable.value;
      });
    }

    const onSuccess = response => router.push(`${params.fqon}/hierarchy/${response.id}`);
    this.props.createWorkspace(params.fqon, payload, onSuccess);
  }

  render() {
    return (
      <ContainmentForm
        title="Create Workspace"
        submitLabel="Create"
        cancelLabel="Cancel"
        onSubmit={values => this.createWorkspace(values)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { workspace, pending } = state.metaResource.workspace;
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

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'workspaceCreate',
  validate
})(OrgCreate));
