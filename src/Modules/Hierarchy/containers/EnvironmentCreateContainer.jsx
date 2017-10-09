import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../components/HierarchyForm/validations';
import actions from '../actions';
import { generateEnvironmentPayload } from '../payloadTransformer';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createEnvironment: PropTypes.func.isRequired,
    environmentPending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  create(values) {
    const { match, history, createEnvironment } = this.props;
    const payload = generateEnvironmentPayload(values);
    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${response.properties.workspace.id}`);

    createEnvironment(match.params.fqon, match.params.workspaceId, payload, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title="Create Environment"
        submitLabel="Create"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.create(values)}
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
        env: [],
      }
    }
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'environmentCreate',
  validate
})(withContext(OrgCreate))));
