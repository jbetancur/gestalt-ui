import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import PolicyEventRuleForm from '../components/PolicyEventRuleForm';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateEventRuleModel } from '../selectors';
import withPolicyRule from '../hocs/withPolicyRule';

class PolicyEventRuleCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    policyRulePending: PropTypes.bool.isRequired,
    policyRuleActions: PropTypes.object.isRequired,
  };

  create = (values) => {
    const { match, history, policyRuleActions } = this.props;
    const payload = generatePayload(values, false, 'event');
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`);

    policyRuleActions.createPolicyRule({ fqon: match.params.fqon, entityId: match.params.policyId, entityKey: 'policies', payload, onSuccess });
  }

  render() {
    const { initialValues, policyRulePending } = this.props;

    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create a Policy Event Rule" />

          {policyRulePending && <ActivityContainer id="policyRule-form" />}

          <Form
            component={PolicyEventRuleForm}
            onSubmit={this.create}
            initialValues={initialValues}
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialValues: getCreateEventRuleModel(state),
});

export default compose(
  withPolicyRule,
  connect(mapStateToProps, actions),
)(PolicyEventRuleCreate);
