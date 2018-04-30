import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { PolicyRules } from 'Modules/PolicyRules';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Col, Row } from 'react-flexybox';
import ActionsToolbar from 'components/ActionsToolbar';
import { FullPageFooter } from 'components/FullPage';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Tabs, Tab } from 'components/Tabs';
import PolicyTypesMenu from '../components/PolicyTypesMenu';
import PolicyForm from './PolicyForm';
import validate from './validations';
import actions from '../actions';
import { generatePolicyPatches } from '../payloadTransformer';
import { getEditPolicyModel } from '../selectors';

class PolicyEdit extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    policy: PropTypes.object.isRequired,
    fetchPolicy: PropTypes.func.isRequired,
    updatePolicy: PropTypes.func.isRequired,
    policyPending: PropTypes.bool.isRequired,
    unloadPolicy: PropTypes.func.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, fetchPolicy } = this.props;
    fetchPolicy(match.params.fqon, match.params.policyId);
  }

  componentWillUnmount() {
    const { unloadPolicy } = this.props;

    unloadPolicy();
  }

  udpate = (values) => {
    const { dispatch, reset, match, policy, updatePolicy } = this.props;
    const patches = generatePolicyPatches(policy, values);
    const onSuccess = () => dispatch(reset());

    updatePolicy(match.params.fqon, policy.id, patches, onSuccess);
  }

  showEntitlements = () => {
    const { entitlementActions, policy, match } = this.props;

    entitlementActions.showEntitlementsModal(policy.name, match.params.fqon, policy.id, 'policies', 'Policy');
  }

  render() {
    const { match, initialFormValues, policy, policyPending } = this.props;

    return (
      policyPending && !policy.id ?
        <ActivityContainer id="policy-load" /> :
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12} md={12}>

            <ActionsToolbar
              title={policy.name}
              actions={[
                <PolicyTypesMenu key="policy--types-menu" />,
                <Button
                  key="policy--entitlements"
                  flat
                  iconChildren="security"
                  onClick={this.showEntitlements}
                >
                  Entitlements
                </Button>]}
            />

            {policyPending && <ActivityContainer id="policy-form" />}

            <Tabs>
              <Tab title="Rules">
                <Row gutter={5}>
                  <Col flex={12}>
                    <PolicyRules {...this.props} />
                  </Col>
                </Row>
                <FullPageFooter>
                  <Button
                    flat
                    iconChildren="arrow_back"
                    component={Link}
                    to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies`}
                  >
                    Policies
                  </Button>
                </FullPageFooter>
              </Tab>

              <Tab title="Policy">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Panel title="Resource Details" defaultExpanded={false}>
                      <DetailsPane model={policy} />
                    </Panel>
                  </Col>
                </Row>

                <Form
                  editMode
                  render={PolicyForm}
                  onSubmit={this.udpate}
                  validate={validate}
                  initialValues={initialFormValues}
                  {...this.props}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
    );
  }
}

const mapStateToProps = state => ({
  policy: state.metaResource.policy.policy,
  initialFormValues: getEditPolicyModel(state),
});

export default compose(
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, actions),
)(PolicyEdit);
