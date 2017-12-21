import React from 'react';
import PropTypes from 'prop-types';
import { Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexybox';
import { Card, CardTitle, CardText, LinearProgress } from 'react-md';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import { Checkbox as CheckboxForm, SelectField, TextField } from 'components/ReduxFormFields';
import Fieldset from 'components/Fieldset';
import DetailsPane from 'components/DetailsPane';
import { nameMaxLen } from './validations';
import policyResourceTypes from '../../lists/policyResourceTypes';
import policyOperators from '../../lists/policyOperators';

const PolicyLimitRuleForm = (props) => {
  const {
    match,
    policyRulePending,
    policyRuleUpdatePending,
    onSubmit,
    invalid,
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
    dispatch,
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
    // when
    dispatch(change('properties.eval_logic.operator', ''));
    dispatch(change('properties.eval_logic.value', ''));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
              disabled={pristine || policyRulePending || invalid || submitting}
              primary
            >
              {submitLabel}
            </Button>
          </ActionsToolbar>
          {(policyRuleUpdatePending || policyRulePending) && <LinearProgress id="policyRule-form" style={{ zIndex: 999 }} />}
          <CardText>
            <Row gutter={5}>
              <Col flex={4} xs={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  maxLength={nameMaxLen}
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
              <Fieldset legend="Actions">
                <Row>
                  {policyActions.map(action => (
                    <Col flex={2} xs={12} sm={6} md={4}>
                      <Field
                        key={action.name}
                        id={action.name}
                        component={CheckboxForm}
                        label={action.name}
                        checked={!!selectedActions.find(a => a === action.name)}
                        name="properties.match_actions" // this is just a stub to change form touch state and is not used in the final form values
                        onChange={() => onActionChecked(action.name)}
                      />
                    </Col>))}
                </Row>
              </Fieldset>
            </Row>
          </CardText>
        </Col>
      </Row>
    </form>
  );
};

PolicyLimitRuleForm.propTypes = {
  handleSelectedActions: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  policyRule: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  policyRulePending: PropTypes.bool.isRequired,
  policyRuleUpdatePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  values: PropTypes.object.isRequired,
  selectedActions: PropTypes.array.isRequired,
};

PolicyLimitRuleForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
};

export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(PolicyLimitRuleForm);
