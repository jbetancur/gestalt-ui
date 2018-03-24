import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import { Card, CardTitle, CardText, MenuButton, ListItem } from 'react-md';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import { TextField } from 'components/ReduxFormFields';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import Form from 'components/Form';
import { ActivityContainer } from 'components/ProgressIndicators';
import { PolicyRules } from 'Modules/PolicyRules';
import policyTypes from '../lists/policyTypes';

const PolicyForm = (props) => {
  const {
    match,
    policyPending,
    policy,
    onSubmit,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    editMode,
  } = props;

  const ruleTypes = () => (
    policyTypes.map(type => (
      <ListItem
        key={type.value}
        primaryText={type.displayName}
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}/rules/create${type.name}Rule`}
      />)
    ));

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off" disabled={policyPending}>
      {policy.id &&
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12} md={12}>
            <DetailsPane model={policy} />
          </Col>
        </Row>}
      <Row gutter={5} center>
        <Col component={Card} flex={10} xs={12} sm={12} md={12}>
          <CardTitle title={title} />
          <ActionsToolbar>
            <Row>
              <Col flex={12}>
                <Button
                  flat
                  iconChildren="arrow_back"
                  disabled={policyPending || submitting}
                  component={Link}
                  to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies`}
                >
                  {cancelLabel}
                </Button>
                <Button
                  raised
                  iconChildren="save"
                  type="submit"
                  disabled={pristine || policyPending || submitting}
                  primary
                >
                  {submitLabel}
                </Button>
                {editMode && policy.id && [
                  <MenuButton
                    id="add-policyRule"
                    key="add-policyRule"
                    flat
                    sameWidth
                    primary
                    position="below"
                    menuItems={ruleTypes()}
                    iconChildren="playlist_add_check"
                    style={{ marginLeft: '.1em' }}
                  >
                    Add Policy Rule
                  </MenuButton>,
                  <Button
                    key="policy--entitlements"
                    flat
                    iconChildren="security"
                    onClick={() => props.entitlementActions.showEntitlementsModal(props.title, props.match.params.fqon, policy.id, 'policies', 'Policy')}
                  >
                    Policy Entitlements
                  </Button>]}
              </Col>
            </Row>
          </ActionsToolbar>

          {policyPending && <ActivityContainer id="policy-form" />}

          <CardText>
            <Row gutter={5}>
              <Col flex={12}>
                <Panel title="General" expandable={false}>
                  <Row gutter={5}>
                    <Col flex={5} xs={12}>
                      <Field
                        component={TextField}
                        name="name"
                        label="Name"
                        type="text"
                        required
                        autoComplete="none"
                      />
                    </Col>
                  </Row>
                </Panel>
              </Col>

              <Col flex={12}>
                <Panel title="Description" defaultExpanded={!!policy.description}>
                  <Field
                    component={TextField}
                    name="description"
                    placeholder="Description"
                    type="text"
                    rows={1}
                  />
                </Panel>
              </Col>
            </Row>
          </CardText>
        </Col>

        {(editMode && policy.id) &&
          <Row gutter={5} center>
            <Col flex={10} xs={12} sm={12} md={12}>
              <PolicyRules {...props} />
            </Col>
          </Row>}
      </Row>
    </Form>
  );
};

PolicyForm.propTypes = {
  match: PropTypes.object.isRequired,
  policy: PropTypes.object.isRequired,
  policyPending: PropTypes.bool.isRequired,
  policyUpdatePending: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
  entitlementActions: PropTypes.object,
};

PolicyForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
  entitlementActions: {},
  policyUpdatePending: false,
};

export default PolicyForm;