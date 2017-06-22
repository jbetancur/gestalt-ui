import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import PolicyForm from '../../components/PolicyForm';
import validate from '../../validations';
import actions from '../../actions';

class PolicyEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    policy: PropTypes.object.isRequired,
    fetchPolicy: PropTypes.func.isRequired,
    updatePolicy: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchPolicy } = this.props;
    fetchPolicy(match.params.fqon, match.params.policyId);
  }

  updatePolicy(values) {
    const { id, name, description } = this.props.policy;
    const { match } = this.props;
    const originalModel = {
      name,
      description,
    };

    const patches = jsonPatch.compare(originalModel, values);
    this.props.updatePolicy(match.params.fqon, id, patches);
  }

  render() {
    const { policy, pending } = this.props;
    return pending ? <CircularActivity id="policy-load" /> : <PolicyForm editMode title={policy.name} submitLabel="Update" cancelLabel="Done" onSubmit={values => this.updatePolicy(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { policy, pending } = state.metaResource.policy;

  const model = {
    name: policy.name,
    description: policy.description
  };

  return {
    policy,
    pending,
    updatedPolicy: state.metaResource.policyUpdate.policy,
    policyRuleUpdatePending: state.metaResource.policyRuleUpdate.pending,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'policyEdit',
  validate
})(context(PolicyEdit)));
