import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import { Col, Row } from 'react-flexybox';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import { generateContextEntityState } from 'util/helpers/context';
import PolicyForm from './PolicyForm';
import actions from '../actions';
import { generatePolicyPayload } from '../payloadTransformer';
import withPolicy from '../hocs/withPolicy';

const initialValues = {
  name: '',
  description: '',
  properties: {},
};

class PolicyCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    policyActions: PropTypes.object.isRequired,
    policyPending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, policyActions } = this.props;
    const payload = generatePolicyPayload(values);
    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${response.id}`);
    const entity = generateContextEntityState(match.params);

    policyActions.createPolicy({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, payload, onSuccess });
  }

  render() {
    const { match, policyPending } = this.props;

    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create a Policy" />

          {policyPending && <ActivityContainer id="policy-loading" />}

          <FinalForm
            onSubmit={this.create}
            initialValues={initialValues}
            render={({ handleSubmit, submitting, ...rest }) => (
              <Form
                onSubmit={handleSubmit}
                disabled={policyPending}
                disabledSubmit={submitting}
                submitTitle="Create"
                showCancel
                cancelTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies`}
              >
                <PolicyForm {...rest} />
              </Form>
            )}
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withPolicy,
  connect(null, actions),
)(PolicyCreate);
