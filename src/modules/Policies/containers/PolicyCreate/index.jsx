import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext, Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import PolicyForm from '../../components/PolicyForm';
import validate from '../../validations';
import actions from '../../actions';
import { generatePolicyPayload } from '../../payloadTransformer';

class PolicyCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createPolicy: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  create(values) {
    const { match, history, createPolicy } = this.props;
    const payload = generatePolicyPayload(values);
    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${response.id}/edit`);

    createPolicy(match.params.fqon, match.params.environmentId, payload, onSuccess);
  }

  render() {
    return (
      <div>
        <ContextNavigation
          breadcrumbComponent={<Breadcrumbs />}
        />
        <PolicyForm
          title="Create Policy"
          submitLabel="Create"
          cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
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
})(withContext(PolicyCreate))));
