import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import Form from 'components/Form';
import { Col, Row } from 'react-flexybox';
import { withEntitlements } from 'Modules/Entitlements';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import DetailsPane from 'components/DetailsPane';
import { Tabs, Tab } from 'components/Tabs';
import { Card } from 'components/Cards';
import PayloadViewer from './PayloadViewer';
import PolicyLimitRuleForm from './PolicyLimitRuleForm';
import actions from '../actions';
import limitRuleModel from '../models/limitRule';
import { getEditLimitRuleModel } from '../reducers/selectors';
import withPolicyRule from '../hocs/withPolicyRule';

class PolicyEventRuleEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    policyRule: PropTypes.object.isRequired,
    policyRuleActions: PropTypes.object.isRequired,
    policyRulePending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, policyRuleActions } = this.props;

    policyRuleActions.fetchPolicyRule({ fqon: match.params.fqon, id: match.params.ruleId });
  }

  update = (values) => {
    const { match, policyRule, policyRuleActions } = this.props;
    const payload = limitRuleModel.patch(policyRule, values);

    policyRuleActions.updatePolicyRule({ fqon: match.params.fqon, id: policyRule.id, payload });
  }

  render() {
    const {
      match,
      initialValues,
      policyRule,
      policyRulePending,
      entitlementActions,
    } = this.props;

    if (policyRulePending && !policyRule.id) {
      return <ActivityContainer id="policyRule-load" />;
    }

    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={policyRule.name}
            sticky
            showBackNav
            navTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`}
            actions={[
              <Button
                key="eventRule--entitlements"
                flat
                iconChildren="security"
                onClick={() => entitlementActions.showEntitlementsModal(policyRule.name, match.params.fqon, policyRule.id, 'rules', 'Limit Rule')}
              >
                Entitlements
              </Button>
            ]}
          />

          {policyRulePending && <ActivityContainer id="policyRule-form" />}

          <Tabs>
            <Tab title="Limit Rule">
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Resource Details" defaultExpanded={false}>
                    <DetailsPane model={policyRule} />
                  </Panel>
                </Col>
              </Row>

              <FinalForm
                editMode
                onSubmit={this.update}
                initialValues={initialValues}
                mutators={{ ...arrayMutators }}
                render={({ handleSubmit, submitting, ...rest }) => (
                  <Form
                    onSubmit={handleSubmit}
                    disabled={policyRulePending}
                    disabledSubmit={policyRulePending || submitting}
                    submitTitle="Update"
                  >
                    <PolicyLimitRuleForm {...rest} />
                  </Form>
                )}
                {...this.props}
              />

            </Tab>

            <Tab title="YAML/JSON">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <PayloadViewer
                      value={policyRule}
                      name={policyRule.name}
                    />
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialValues: getEditLimitRuleModel(state),
});

export default compose(
  withPolicyRule,
  withEntitlements,
  connect(mapStateToProps, actions),
)(PolicyEventRuleEdit);
