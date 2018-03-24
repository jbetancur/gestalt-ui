import React from 'react';
import PropTypes from 'prop-types';
import { Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexybox';
import { Card, CardTitle, CardText } from 'react-md';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import { Checkbox as CheckboxForm, SelectField, TextField } from 'components/ReduxFormFields';
import Fieldset from 'components/Fieldset';
import DetailsPane from 'components/DetailsPane';
import Form from 'components/Form';
import policyResourceTypes from '../../lists/policyResourceTypes';
import policyOperators from '../../lists/policyOperators';

const PolicyLimitRuleForm = (props) => {
  const {
    match,
    policyRulePending,
    policyRuleUpdatePending,
    onSubmit,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    values,
    selectedActions,
    policyRule,
    handleSelectedActions,
    change,
  } = props;

  const backLink = `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`;

  // flatten limit arrays for policyResourceTypes
  const policyLimiters = [].concat(...Object.keys(policyResourceTypes).map(key => policyResourceTypes[key].limits));
  const policyActions = [].concat(...Object.keys(policyResourceTypes).map(key => policyResourceTypes[key].events));
  // Filter policyLimiters and policyOperators to match inputTypes
  const filteredPolicyOperators = values.properties.eval_logic.property ? policyOperators.filter((operator) => {
    const limiterIndex = policyLimiters.findIndex(limiter => limiter.name === values.properties.eval_logic.property);
    return operator.inputType === policyLimiters[limiterIndex].inputType;
  }) : [];

  const valueType = values.properties.eval_logic.property ? policyLimiters.find(limiter => limiter.name === values.properties.eval_logic.property).inputType : 'text';

  const onActionChecked = (action) => {
    handleSelectedActions(action, selectedActions);
  };

  const handleEvalFields = () => {
    // since we need to deal with input types we should clear the form value fields
    change('properties.eval_logic.operator', '');
    change('properties.eval_logic.value', '');
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off" disabled={policyRuleUpdatePending || policyRulePending}>
      {policyRule.id &&
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12} md={12}>
            <DetailsPane model={policyRule} />
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
                  disabled={policyRulePending || submitting}
                  component={Link}
                  to={backLink}
                >
                  {cancelLabel}
                </Button>
                <Button
                  raised
                  iconChildren="save"
                  type="submit"
                  disabled={pristine || policyRulePending || submitting}
                  primary
                >
                  {submitLabel}
                </Button>
                {policyRule.id &&
                <Button
                  key="eventRule--entitlements"
                  flat
                  iconChildren="security"
                  onClick={() => props.entitlementActions.showEntitlementsModal(props.title, props.match.params.fqon, policyRule.id, 'rules', 'Limit Rule')}
                >
                  Rule Entitlements
                </Button>}
              </Col>
            </Row>
          </ActionsToolbar>
          {(policyRuleUpdatePending || policyRulePending) && <ActivityContainer id="policyRule-form" />}
          <CardText>
            <Row gutter={5}>
              <Col flex={4} xs={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                />
              </Col>
              <Col flex={8} xs={12}>
                <Field
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  rows={1}
                />
              </Col>
              <Row gutter={5}>
                <Col flex={3} xs={12}>
                  <Field
                    id="rule-eval-property"
                    component={SelectField}
                    menuItems={policyLimiters}
                    name="properties.eval_logic.property"
                    itemLabel="name"
                    itemValue="name"
                    required
                    label="Limit"
                    onChange={handleEvalFields}
                  />
                </Col>
                {values.properties.eval_logic.property &&
                  <Col flex={3} xs={12}>
                    <Field
                      id="rule-eval-operator"
                      component={SelectField}
                      menuItems={filteredPolicyOperators}
                      name="properties.eval_logic.operator"
                      itemLabel="name"
                      itemValue="name"
                      required
                      label="Operator"
                    />
                  </Col>}
                {values.properties.eval_logic.operator &&
                  <Col flex={3} xs={12}>
                    <Field
                      id="rule-eval-value"
                      component={TextField}
                      name="properties.eval_logic.value"
                      label="Value"
                      type={valueType}
                      parse={valueType === 'number' ? (value => Number(value)) : null} // redux form formats everything as string, so force number
                      required
                    />
                  </Col>}
                <Col flex={3} xs={12}>
                  <Field
                    id="rule-strict"
                    component={CheckboxForm}
                    name="properties.strict"
                    checked={values.properties.strict}
                    label="Strict"
                  />
                </Col>
              </Row>
              <Fieldset legend="Match Actions">
                <Row>
                  {policyActions.map(action => (
                    <Col flex={2} xs={12} sm={6} md={4} key={action.id}>
                      <Field
                        key={action.name}
                        id={action.name}
                        component={CheckboxForm}
                        label={action.name}
                        checked={!!selectedActions.find(a => a === action.name)}
                        name="properties.match_actions" // this is just a stub to change form touch state and is not used in the final form values
                        onChange={() => onActionChecked(action.name)}
                        style={{ margin: 0 }}
                      />
                    </Col>))}
                </Row>
              </Fieldset>
            </Row>
          </CardText>
        </Col>
      </Row>
    </Form>
  );
};

PolicyLimitRuleForm.propTypes = {
  handleSelectedActions: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  policyRule: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  policyRulePending: PropTypes.bool.isRequired,
  policyRuleUpdatePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  values: PropTypes.object.isRequired,
  selectedActions: PropTypes.array.isRequired,
  entitlementActions: PropTypes.object,
};

PolicyLimitRuleForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  entitlementActions: {},
};

export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(PolicyLimitRuleForm);