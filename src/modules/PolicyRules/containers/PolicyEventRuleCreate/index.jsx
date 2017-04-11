import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import PolicyEventRuleForm from '../../components/PolicyEventRuleForm';
import validate from '../../components/PolicyEventRuleForm/validations';
import * as actions from '../../actions';

class PolicyEventRuleCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createPolicyRule: PropTypes.func.isRequired,
    clearSelectedActions: PropTypes.func.isRequired,
    // fetchLambdas: PropTypes.func.isRequired,
    selectedActions: PropTypes.array.isRequired,
  };

  // componentDidMount() {
  //   const { params, fetchLambdas } = this.props;
  //   fetchLambdas(params.fqon, params.environmentId);
  // }

  componentWillUnmount() {
    this.props.clearSelectedActions();
  }

  create(values) {
    const { params, router, createPolicyRule, selectedActions } = this.props;
    const payload = { ...values };
    payload.resource_type = 'Gestalt::Resource::Rule::Event';
    payload.properties.actions = selectedActions;

    const onSuccess = () => router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/policies/${params.policyId}/edit`);
    createPolicyRule(params.fqon, params.policyId, payload, onSuccess);
  }

  render() {
    return <PolicyEventRuleForm title="Create Event Rule" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.metaResource.policy;
  const model = {
    name: '',
    description: '',
    properties: {
      parent: {},
      lambda: '',
      actions: [],
    }
  };

  return {
    policyRule: model,
    pending,
    selectedActions: state.policyRules.selectedActions.selectedActions,
    // lambdas: state.policyRules.lambdas.lambdas,
    // pendingLambdas: state.policyRules.lambdas.pending,
    initialValues: model
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'policyEventRuleCreate',
  validate
})(PolicyEventRuleCreate));
