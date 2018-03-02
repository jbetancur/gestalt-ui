import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import ActivityContainer from 'components/ActivityContainer';
import PolicyForm from '../components/PolicyForm';
import validate from '../validations';
import actions from '../actions';
import { generatePolicyPatches } from '../payloadTransformer';

class PolicyEdit extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    policy: PropTypes.object.isRequired,
    fetchPolicy: PropTypes.func.isRequired,
    updatePolicy: PropTypes.func.isRequired,
    policyPending: PropTypes.bool.isRequired,
    unloadPolicy: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchPolicy } = this.props;
    fetchPolicy(match.params.fqon, match.params.policyId);
  }

  componentWillUnmount() {
    const { unloadPolicy } = this.props;

    unloadPolicy();
  }

  updatePolicy = (values) => {
    const { dispatch, reset, match, policy, updatePolicy } = this.props;
    const patches = generatePolicyPatches(policy, values);
    const onSuccess = () => dispatch(reset());

    updatePolicy(match.params.fqon, policy.id, patches, onSuccess);
  }

  render() {
    const { policy, policyPending } = this.props;

    return (
      <div>
        {policyPending && !policy.id ?
          <ActivityContainer id="policy-load" /> :
          <PolicyForm
            editMode
            title={policy.name}
            submitLabel="Update"
            cancelLabel="Policies"
            onSubmit={this.updatePolicy}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { policy } = state.metaResource.policy;

  const model = {
    name: policy.name,
    description: policy.description,
  };

  return {
    policy,
    initialValues: model,
  };
}

export default compose(
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'policyEdit',
    enableReinitialize: true,
    validate,
  }),
)(PolicyEdit);
