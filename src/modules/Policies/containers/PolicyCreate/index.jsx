import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PolicyForm from '../../components/PolicyForm';
import validate from '../../validations';
import * as actions from '../../actions';

class PolicyCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createPolicy: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.onUnload();
  }

  create(values) {
    const { params, createPolicy } = this.props;
    createPolicy(params.fqon, params.workspaceId, params.environmentId, values, this.props.router.location.state.environment);
  }

  render() {
    return <PolicyForm title="Create Policy" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.policies.fetchOne;
  const model = {
    name: '',
    description: '',
    properties: {}
  };

  return {
    pending,
    // selectedPolicyType: state.policies.selectedPolicy.type,
    initialValues: model
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'policyCreate',
  validate
})(PolicyCreate));
