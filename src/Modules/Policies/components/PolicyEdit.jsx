import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import { PolicyRules } from 'Modules/PolicyRules';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Col, Row } from 'react-flexybox';
import ActionsToolbar from 'components/ActionsToolbar';
import { FlatButton } from 'components/Buttons';
import { EntitlementIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Tabs, Tab } from 'components/Tabs';
import { Card } from 'components/Cards';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import PayloadViewer from './PayloadViewer';
import PolicyTypesMenu from './PolicyTypesMenu';
import PolicyForm from './PolicyForm';
import { getEditPolicyModel } from '../reducers/selectors';
import withPolicy from '../hocs/withPolicy';
import policyModel from '../models/policy';

class PolicyEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    policy: PropTypes.object.isRequired,
    policyActions: PropTypes.object.isRequired,
    policyPending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  };

  static contextType = ModalContext;

  componentDidMount() {
    const { match, policyActions } = this.props;

    policyActions.fetchPolicy({ fqon: match.params.fqon, id: match.params.policyId });
  }

  udpate = (values) => {
    const { match, policy, policyActions } = this.props;
    const payload = policyModel.patch(policy, values);

    policyActions.updatePolicy({ fqon: match.params.fqon, id: policy.id, payload });
  }

  showEntitlements = () => {
    const { policy } = this.props;

    const { showModal } = this.context;

    showModal(EntitlementModal, {
      title: `Entitlements for "${policy.name}" Policy`,
      fqon: policy.org.properties.fqon,
      entityId: policy.id,
      entityKey: 'policies',
    });
  }

  render() {
    const { match, initialFormValues, policy, policyPending } = this.props;

    if (policyPending && !policy.id) {
      return <ActivityContainer id="policy-load" />;
    }
    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>

          <ActionsToolbar
            title={policy.name}
            sticky
            showBackNav
            navTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies`}
            actions={[
              <PolicyTypesMenu key="policy--types-menu" />,
              <FlatButton
                key="policy--entitlements"
                icon={<EntitlementIcon size={20} />}
                label="Entitlements"
                onClick={this.showEntitlements}
              />]}
          />

          {policyPending && <ActivityContainer id="policy-form" />}

          <Tabs>
            <Tab title="Rules">
              <Row gutter={5}>
                <Col flex={12}>
                  {policy.id && <PolicyRules />}
                </Col>
              </Row>
            </Tab>

            <Tab title="Policy">
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Resource Details" defaultExpanded={false}>
                    <DetailsPane model={policy} />
                  </Panel>
                </Col>
              </Row>

              <FinalForm
                editMode
                onSubmit={this.udpate}
                initialValues={initialFormValues}
                render={({ handleSubmit, submitting, ...rest }) => (
                  <Form
                    onSubmit={handleSubmit}
                    disabled={policyPending}
                    disabledSubmit={submitting}
                    submitTitle="Update"
                  >
                    <PolicyForm {...rest} />
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
                      value={policy}
                      name={policy.name}
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
  policy: state.policies.policy.policy,
  initialFormValues: getEditPolicyModel(state),
});

export default compose(
  withPolicy,
  connect(mapStateToProps),
)(PolicyEdit);
