import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import PolicyForm from './PolicyForm';
import validate from '../validations';
import actions from '../actions';
import { generatePolicyPayload } from '../payloadTransformer';

class PolicyCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createPolicy: PropTypes.func.isRequired,
  };

  create(values) {
    const { match, history, createPolicy } = this.props;
    const payload = generatePolicyPayload(values);
    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${response.id}`);

    createPolicy(match.params.fqon, match.params.environmentId, payload, onSuccess);
  }

  render() {
    return (
      <div>
        <PolicyForm
          title="Create Policy"
          submitLabel="Create"
          cancelLabel="Policies"
          onSubmit={values => this.create(values)}
          {...this.props}
        />
      </div>
    );
  }
}

function mapStateToProps() {
  const model = {
    name: '',
    description: '',
    properties: {},
  };

  return {
    policy: model,
    initialValues: model
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'policyCreate',
  validate
})(PolicyCreate)));
