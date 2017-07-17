import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import HierarchyForm from '../../components/HierarchyForm';
import validate from '../../components/HierarchyForm/validations';
import actions from '../../actions';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createWorkspace: PropTypes.func.isRequired,
    workspacePending: PropTypes.bool.isRequired,
  };

  createWorkspace(values) {
    const { match, history } = this.props;

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

    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${response.id}`);
    this.props.createWorkspace(match.params.fqon, payload, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title="Create Workspace"
        submitLabel="Create"
        cancelLabel="Cancel"
        onSubmit={values => this.createWorkspace(values)}
        pending={this.props.workspacePending}
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
        env: {}
      }
    }
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'workspaceCreate',
  validate
})(withContext(OrgCreate))));
