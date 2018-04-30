import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import { withMetaResource } from 'Modules/MetaResource';
import { Col, Row } from 'react-flexybox';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import PolicyForm from './PolicyForm';
import validate from './validations';
import actions from '../actions';
import { generatePolicyPayload } from '../payloadTransformer';

const initialValues = {
  name: '',
  description: '',
  properties: {},
};

class PolicyCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createPolicy: PropTypes.func.isRequired,
    policyPending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, createPolicy } = this.props;
    const payload = generatePolicyPayload(values);
    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${response.id}`);

    createPolicy(match.params.fqon, match.params.environmentId, payload, onSuccess);
  }

  render() {
    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create a Policy" />

          {this.props.policyPending && <ActivityContainer id="policy-loading" />}

          <Form
            render={PolicyForm}
            onSubmit={this.create}
            validate={validate}
            initialValues={initialValues}
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withMetaResource,
  connect(null, actions),
)(PolicyCreate);
