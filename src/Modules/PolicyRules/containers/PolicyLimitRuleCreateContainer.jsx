import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import PolicyLimitRuleForm from '../components/PolicyLimitRuleForm';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateLimitRuleModel } from '../selectors';
import withPolicyRule from '../hocs/withPolicyRule';

class PolicyLimitRuleCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    policyRulePending: PropTypes.bool.isRequired,
    policyRuleActions: PropTypes.object.isRequired,
  };

  create = (values) => {
    const { match, history, policyRuleActions } = this.props;
    const payload = generatePayload(values, false, 'limit');
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`);

    policyRuleActions.createPolicyRule({ fqon: match.params.fqon, entityId: match.params.policyId, entityKey: 'policies', payload, onSuccess });
  }

  render() {
    const { initialValues, policyRulePending } = this.props;

    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create a Policy Limit Rule" />

          {policyRulePending && <ActivityContainer id="policyRule-form" />}

          <Form
            component={PolicyLimitRuleForm}
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
  initialValues: getCreateLimitRuleModel(state),
});

export default compose(
  withPolicyRule,
  connect(mapStateToProps, actions),
)(PolicyLimitRuleCreate);
