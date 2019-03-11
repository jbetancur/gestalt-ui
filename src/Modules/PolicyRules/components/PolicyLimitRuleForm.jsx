import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import InputIcon from '@material-ui/icons/Input';
import EvalIcon from '@material-ui/icons/PlaylistAddCheck';
import { Panel } from 'components/Panels';
import { ConditionalAny, Checkbox as CheckboxForm, SelectField, TextField } from 'components/Form';
import { fixInputNumber, composeValidators, required } from 'util/forms';
import policyResourceTypes from '../lists/policyResourceTypes';
import policyOperators from '../lists/policyOperators';
import MatchActions from './MatchActions';

// flatten limit arrays for policyResourceTypes
const policyLimiters = [].concat(...Object.keys(policyResourceTypes).map(key => policyResourceTypes[key].limits));
const policyActions = []
  .concat(...Object.keys(policyResourceTypes)
    .map(key => policyResourceTypes[key].events)
    .flatMap(trigger => trigger.map(item => item.name)));

const PolicyLimitRuleForm = ({
  form,
  values,
}) => {
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

  const handleEvalFields = (e) => {
    // since we need to deal with input types we should clear the form value fields
    form.change('properties.eval_logic.property', e.target.value);
    form.change('properties.eval_logic.operator', '');
    form.change('properties.eval_logic.value', '');
  };

  return (
    <React.Fragment>
      <Row gutter={5}>
        <Col flex={12}>
          <Panel expandable={false} fill>
            <Row gutter={5}>
              <Col flex={6} xs={12}>
                <Field
                  id="name"
                  component={TextField}
                  name="name"
                  label="Event Rule Name"
                  validate={composeValidators(required('policy rule name is required'))}
                  required
                  autoFocus
                />
              </Col>
              <Col flex={6} xs={12}>
                <Field
                  id="description"
                  component={TextField}
                  name="description"
                  label="Description"
                  multiline
                  rowsMax={6}
                />
              </Col>
            </Row>
          </Panel>
        </Col>
      </Row>

      <Row gutter={5}>
        <Col flex={4} xs={12} sm={12}>
          <Panel title="Evaluate" icon={<EvalIcon fontSize="small" color="action" />} expandable={false}>
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
                  type="checkbox"
                  name="properties.strict"
                  label="Strict Property Checking"
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={8} xs={12} sm={12}>
          <Panel title="On Event(s)" icon={<InputIcon fontSize="small" color="action" />} expandable={false} fill noPadding>
            <MatchActions
              fieldName="properties.match_actions"
              actions={policyActions}
              disableBehavior
            />
          </Panel>
        </Col>
      </Row>
    </React.Fragment>
  );
};

PolicyLimitRuleForm.propTypes = {
  form: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

export default PolicyLimitRuleForm;
