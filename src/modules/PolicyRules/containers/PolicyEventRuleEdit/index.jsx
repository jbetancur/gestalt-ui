import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import { cloneDeep } from 'lodash';
import PolicyEventRuleForm from '../../components/PolicyEventRuleForm';
import validate from '../../components/PolicyEventRuleForm/validations';
import * as actions from '../../actions';

class PolicyEventRuleEdit extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    policyRule: PropTypes.object.isRequired,
    fetchPolicyRule: PropTypes.func.isRequired,
    updatePolicyRule: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    selectedActions: PropTypes.array.isRequired,
    clearSelectedActions: PropTypes.func.isRequired,
    handleSelectedActions: PropTypes.func.isRequired,
    // fetchLambdas: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { params, fetchPolicyRule } = this.props;
    fetchPolicyRule(params.fqon, params.policyId, params.ruleId);
    // fetchLambdas(params.fqon, params.environmentId);
  }

  componentWillReceiveProps(nextProps) {
    // propery.actions is an array of values that is not handled via redux form,
    // therefore, we have to load it manually in the redux state for selectedActions
    if (nextProps.policyRule.properties.actions && nextProps.policyRule !== this.props.policyRule) {
      this.props.handleSelectedActions(null, nextProps.policyRule.properties.actions);
    }
  }

  componentWillUnmount() {
    const { clearSelectedActions } = this.props;
    clearSelectedActions();
  }

  updatePolicyRule(values) {
    const { id, name, description, properties } = this.props.policyRule;
    const { params, router, selectedActions } = this.props;
    const originalModel = {
      name,
      description,
      properties
    };

    const payload = cloneDeep({ ...values });
    payload.properties.lambda = values.properties.lambda.id;
    payload.properties.actions = selectedActions;

    const patches = jsonPatch.compare(originalModel, payload);
    if (patches.length) {
      const onSuccess = () => router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/policies/${params.policyId}/edit`);
      this.props.updatePolicyRule(params.fqon, params.policyId, id, patches, onSuccess);
    }
  }

  render() {
    const { policyRule, pending } = this.props;
    return pending ? <CircularActivity id="policyRule-load" /> : <PolicyEventRuleForm editMode title={policyRule.name} submitLabel="Update" cancelLabel="Back" onSubmit={values => this.updatePolicyRule(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { policyRule, pending } = state.metaResource.policyRule;

  const model = {
    name: policyRule.name,
    description: policyRule.description,
    properties: policyRule.properties,
  };

  return {
    policyRule,
    pending,
    selectedActions: state.policyRules.selectedActions.selectedActions,
    updatedPolicyRule: state.metaResource.policyRuleUpdate.policyRule,
    policyUpdatePending: state.metaResource.policyRuleUpdate.pending,
    lambdaProvider: state.metaResource.lambdaProvider.provider,
    lambdasDropDown: state.metaResource.lambdasDropDown.lambdas,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'policyEventRuleEdit',
  validate
})(PolicyEventRuleEdit));
