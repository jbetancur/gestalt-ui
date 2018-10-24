import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexybox';
import { FontIcon } from 'react-md';
import { FullPageFooter } from 'components/FullPage';
import { Panel } from 'components/Panels';
import { Button } from 'components/Buttons';
import { Checkbox as CheckboxForm, SelectField, TextField } from 'components/ReduxFormFields';
import Form, { ConditionalAny } from 'components/Form';
import { fixInputNumber, composeValidators, required } from 'util/forms';
import policyResourceTypes from '../lists/policyResourceTypes';
import policyOperators from '../lists/policyOperators';
import SelectionControlCheckboxes from './SelectionCheckboxes';

// flatten limit arrays for policyResourceTypes
const policyLimiters = [].concat(...Object.keys(policyResourceTypes).map(key => policyResourceTypes[key].limits));
const policyActions = []
  .concat(...Object.keys(policyResourceTypes)
    .map(key => policyResourceTypes[key].events)
    .flatMap(trigger => trigger.map(item => item.name)));

const PolicyLimitRuleForm = ({
  form,
  values,
  editMode,
  match,
  policyRulePending,
  submitting,
  handleSubmit,
  policyRule,
}) => {
  const backLink = `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`;
  // Filter policyLimiters and policyOperators to match inputTypes
  const filteredPolicyOperators = values.properties.eval_logic.property
    ? policyOperators.filter((operator) => {
      const limiterIndex = policyLimiters.findIndex(limiter => limiter.name === values.properties.eval_logic.property);

      return operator.inputType === policyLimiters[limiterIndex].inputType;
    })
    : [];

  const valueType = values.properties.eval_logic.property
    ? policyLimiters.find(limiter => limiter.name === values.properties.eval_logic.property).inputType
    : 'text';

  const handleItemsSelected = (items) => {
    form.change('properties.match_actions', items);
  };

  const handleEvalFields = (value) => {
    // since we need to deal with input types we should clear the form value fields
    form.change('properties.eval_logic.property', value);
    form.change('properties.eval_logic.operator', '');
    form.change('properties.eval_logic.value', '');
  };

  return (
    <Form onSubmit={handleSubmit} autoComplete="off" disabled={policyRulePending}>
      <Row gutter={5}>
        <Col flex={7} xs={12} sm={12}>
          <Panel title="Name" expandable={false} fill>
            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  id="name"
                  component={TextField}
                  name="name"
                  label="Limit Rule Name"
                  validate={composeValidators(required('policy rule name is required'))}
                  required
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={5} xs={12} sm={12}>
          <Panel title="Description" expandable={false} fill>
            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  id="description"
                  component={TextField}
                  name="description"
                  placeholder="Description"
                  rows={1}
                  maxRows={6}
                />
              </Col>
            </Row>
          </Panel>
        </Col>
      </Row>

      <Row gutter={5}>
        <Col flex={4} xs={12} sm={12}>
          <Panel title="Evaluation Logic" icon={<FontIcon>playlist_add_check</FontIcon>} expandable={false}>
            <Row gutter={5}>
              <Col flex={12}>
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
                  validate={composeValidators(required('a limit is required'))}
                  deleteKeys={['inputType']}
                />
              </Col>

              <Col flex={12}>
                <ConditionalAny when="properties.eval_logic.property">
                  <Field
                    id="rule-eval-operator"
                    component={SelectField}
                    menuItems={filteredPolicyOperators}
                    name="properties.eval_logic.operator"
                    itemLabel="name"
                    itemValue="name"
                    required
                    label="Operator"
                    validate={composeValidators(required('an operator is required'))}
                    deleteKeys={['inputType']}
                  />
                </ConditionalAny>
              </Col>

              <Col flex={12}>
                <ConditionalAny when="properties.eval_logic.operator">
                  <Field
                    id="rule-eval-value"
                    component={TextField}
                    name="properties.eval_logic.value"
                    label="Value"
                    type={valueType}
                    parse={valueType === 'number' ? fixInputNumber : null}
                    format={valueType === 'number' ? fixInputNumber : null}
                    required
                    validate={composeValidators(required('a value is required'))}
                  />
                </ConditionalAny>
              </Col>
              <Col flex={12}>
                <Field
                  id="rule-strict"
                  component={CheckboxForm}
                  name="properties.strict"
                  checked={values.properties.strict}
                  label="Strict"
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={8} xs={12} sm={12}>
          <Panel title="Match On" icon={<FontIcon>done</FontIcon>} expandable={false} fill>
            <SelectionControlCheckboxes
              name="properties.match_actions"
              items={policyActions}
              selectedItems={values.properties.match_actions}
              onItemSelected={handleItemsSelected}
            />
          </Panel>
        </Col>
      </Row>

      <FullPageFooter>
        <Button
          flat
          iconChildren="arrow_back"
          disabled={policyRulePending || submitting}
          component={Link}
          to={backLink}
        >
          {editMode ? `${policyRule.properties.parent && policyRule.properties.parent.name} Policy` : 'Cancel'}
        </Button>
        <Button
          raised
          iconChildren="save"
          type="submit"
          disabled={policyRulePending || submitting}
          primary
        >
          {editMode ? 'Update' : 'Create'}
        </Button>
      </FullPageFooter>
    </Form>
  );
};

PolicyLimitRuleForm.propTypes = {
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  policyRule: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  policyRulePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

PolicyLimitRuleForm.defaultProps = {
  editMode: false,
};

export default PolicyLimitRuleForm;
