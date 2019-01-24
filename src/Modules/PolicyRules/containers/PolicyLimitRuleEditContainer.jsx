import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { withEntitlements } from 'Modules/Entitlements';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import DetailsPane from 'components/DetailsPane';
import { Tabs, Tab } from 'components/Tabs';
import { Card } from 'components/Cards';
import PayloadViewer from '../components/PayloadViewer';
import PolicyLimitRuleForm from '../components/PolicyLimitRuleForm';
import actions from '../actions';
import { generatePatches } from '../payloadTransformer';
import { getEditLimitRuleModel } from '../selectors';
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
    const payload = generatePatches(policyRule, values, 'limit');

    if (payload.length) {
      policyRuleActions.updatePolicyRule({ fqon: match.params.fqon, id: policyRule.id, payload });
    }
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

              <Form
                component={PolicyLimitRuleForm}
                editMode
                onSubmit={this.update}
                initialValues={initialValues}
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
