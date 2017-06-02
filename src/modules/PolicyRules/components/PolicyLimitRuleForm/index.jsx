import React from 'react';
import PropTypes from 'prop-types';
import { Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Button } from 'components/Buttons';
import SelectField from 'components/SelectField';
import TextField from 'components/TextField';
import CheckboxForm from 'components/Checkbox';
import Breadcrumbs from 'modules/Breadcrumbs';
import { nameMaxLen } from './validations';
import policyResourceTypes from '../../lists/policyResourceTypes';
import policyOperators from '../../lists/policyOperators';

const PolicyLimitRuleForm = (props) => {
  const {
    params,
    pending,
    policyUpdatePending,
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
  } = props;

  const backLink = `${params.fqon}/hierarchy/${params.workspaceId}/environments/${params.environmentId}/policies/${params.policyId}/edit`;

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
    props.handleSelectedActions(action, selectedActions);
  };

  const handleEvalFields = () => {
    // since we need to deal with input types we should clear the form value fields
    // when
    props.dispatch(props.change('properties.eval_logic.operator', ''));
    props.dispatch(props.change('properties.eval_logic.value', ''));
  };

  return (
    <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="flex-row center-center">
        <Card className="flex-10 flex-xs-12 flex-sm-12">
          <CardTitle
            title={
              <div>
                <div>{title}</div>
                <div className="md-caption"><Breadcrumbs />&nbsp;/&nbsp;
                  <Link
                    className="md-caption"
                    style={{ textDecoration: 'none' }}
                    to={{
                      pathname: backLink
                    }}
                  >
                    Policy
                  </Link><span> / Limit Policy</span></div>
              </div>
            }
            subtitle={policyRule.id ? policyRule.id : null}
          />
          <CardText>
            <div className="flex-row">
              <Field
                className="flex-4 flex-xs-12"
                component={TextField}
                name="name"
                label="Name"
                type="text"
                required
                maxLength={nameMaxLen}
              />
              <Field
                className="flex-8 flex-xs-12"
                component={TextField}
                name="description"
                label="Description"
                type="text"
              />
              <div className="flex-row">
                <Field
                  id="rule-eval-property"
                  className="flex-3 flex-xs-12"
                  component={SelectField}
                  menuItems={policyLimiters}
                  name="properties.eval_logic.property"
                  itemLabel="name"
                  itemValue="name"
                  required
                  label="Limit"
                  onChange={() => handleEvalFields()}
                />
                {values.properties.eval_logic.property ?
                  <Field
                    id="rule-eval-operator"
                    className="flex-3 flex-xs-12"
                    component={SelectField}
                    menuItems={filteredPolicyOperators}
                    name="properties.eval_logic.operator"
                    itemLabel="name"
                    itemValue="name"
                    required
                    label="Operator"
                  /> : null }
                {values.properties.eval_logic.operator ?
                  <Field
                    id="rule-eval-value"
                    className="flex-3 flex-xs-12"
                    component={TextField}
                    name="properties.eval_logic.value"
                    label="Value"
                    type={valueType}
                    parse={valueType === 'number' ? (value => Number(value)) : null}  // redux form formats everything as string, so force number
                    required
                  /> : null}
                <Field
                  className="flex-3 flex-xs-12"
                  id="rule-strict"
                  component={CheckboxForm}
                  name="properties.strict"
                  checked={values.properties.strict}
                  label="Strict"
                />
              </div>
              <fieldset>
                <legend>Actions</legend>
                <div className="flex-row">
                  {policyActions.map(action =>
                    <Field
                      key={action.name}
                      className="flex-2 flex-xs-12 flex-sm-6 flex-md-4"
                      id={action.name}
                      component={CheckboxForm}
                      label={action.name}
                      checked={!!selectedActions.find(a => a === action.name)}
                      name="properties.actions" // this is just a stub to change form touch state and is not used in the final form values
                      onChange={() => onActionChecked(action.name)}
                    />)}
                </div>
              </fieldset>
            </div>
          </CardText>
          {policyUpdatePending || pending ? <LinearProgress id="policyRule-form" style={{ zIndex: 999 }} /> : null}
          <CardActions>
            <Button
              flat
              label={cancelLabel}
              disabled={pending || submitting}
              component={Link}
              to={{
                pathname: backLink
              }}
            />
            <Button
              raised
              label={submitLabel}
              type="submit"
              disabled={pristine || pending || invalid || submitting}
              primary
            />
          </CardActions>
        </Card>
      </div>
    </form>
  );
};

PolicyLimitRuleForm.propTypes = {
  policyRule: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
  policyUpdatePending: PropTypes.bool.isRequired,
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
