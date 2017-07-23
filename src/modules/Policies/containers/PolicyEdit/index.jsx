import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import PolicyForm from '../../components/PolicyForm';
import validate from '../../validations';
import actions from '../../actions';
import { generatePolicyPatches } from '../../payloadTransformer';

class PolicyEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    policy: PropTypes.object.isRequired,
    fetchPolicy: PropTypes.func.isRequired,
    updatePolicy: PropTypes.func.isRequired,
    policyPending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchPolicy } = this.props;
    fetchPolicy(match.params.fqon, match.params.policyId);
  }

  updatePolicy(values) {
    const { match, policy, updatePolicy } = this.props;
    const patches = generatePolicyPatches(policy, values);

    updatePolicy(match.params.fqon, policy.id, patches);
  }

  render() {
    const { policy, policyPending } = this.props;
    return policyPending ?
      <ActivityContainer id="policy-load" /> :
      <PolicyForm
        editMode
        title={policy.name}
        submitLabel="Update"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.updatePolicy(values)}
        {...this.props}
      />;
  }
}

function mapStateToProps(state) {
  const { policy } = state.metaResource.policy;

  const model = {
    name: policy.name,
    description: policy.description
  };

  return {
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'policyEdit',
  validate
})(withContext(PolicyEdit))));
