import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
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
    policyPending: PropTypes.bool.isRequired,
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
    const { policy, policyPending } = this.props;
    return policyPending ?
      <ActivityContainer id="policy-load" /> :
      <PolicyForm
        editMode
        title={policy.name}
        submitLabel="Update"
        cancelLabel="Done"
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
})(context(PolicyEdit))));
