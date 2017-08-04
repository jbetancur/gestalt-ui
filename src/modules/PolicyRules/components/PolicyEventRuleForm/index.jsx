import React from 'react';
import PropTypes from 'prop-types';
import { Field, getFormValues, change } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Autocomplete from 'react-md/lib/Autocompletes';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import CheckboxForm from 'components/Checkbox';
import { nameMaxLen } from './validations';
import policyResourceTypes from '../../lists/policyResourceTypes';

const PolicyEventRuleForm = (props) => {
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
    selectedActions,
    editMode,
    policyRule,
    lambdasDropDown,
    lambdasDropDownPending,
    fetchLambdasDropDown,
    handleSelectedActions,
    dispatch,
    form,
  } = props;

  const backLink = `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${match.params.policyId}/edit`;

  const policyTriggers = [].concat(...Object.keys(policyResourceTypes).map(key => policyResourceTypes[key].triggers));

  const onActionChecked = (action) => {
    handleSelectedActions(action, selectedActions);
  };

  const handleAutoComplete = (value) => {
    dispatch(change(form, editMode ? 'properties.lambda.id' : 'properties.lambda', lambdasDropDown.find(l => l.name === value).id));
  };

  return (
    <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="flex-row center-center">
        <Card className="flex-10 flex-xs-12 flex-sm-12">
          <CardTitle
            title={
              <div>
                <Link
                  style={{ color: 'inherit' }}
                  to={backLink}
                >
                  Policies
                </Link>
                <span> - {title}</span>
              </div>
            }
            subtitle={policyRule.id}
          />
          <CardText>
            <div className="flex-row">
              <Field
                className="flex-4 flex-xs-12 flex-sm-6"
                component={TextField}
                name="name"
                label="Name"
                type="text"
                required
                maxLength={nameMaxLen}
              />
              <Field
                className="flex-8 flex-xs-12 flex-sm-6"
                component={TextField}
                name="description"
                label="Description"
                type="text"
              />
              <div className="flex-row">
                <div className="flex-4 flex-sm-6 flex-xs-12">
                  <fieldset>
                    <legend>Lambda</legend>
                    <Autocomplete
                      id="lambdas-dropdown"
                      data={lambdasDropDown}
                      dataLabel="name"
                      dataValue="id"
                      clearOnAutocomplete
                      onClick={() => fetchLambdasDropDown(match.params.fqon)}
                      onAutocomplete={value => handleAutoComplete(value)}
                      placeholder="Search"
                      helpText="search in the current org by lambda name/uuid, or paste a lambda uuid below"
                    />
                    {/* TODO: needs a custom search control since autocomplete above cannot be validated with redux-form so we do it here */}
                    <Field
                      component={TextField}
                      name={editMode ? 'properties.lambda.id' : 'properties.lambda'}
                      label="Lambda UUID"
                    />
                  </fieldset>
                </div>
                <div className="flex-8 flex-xs-12 flex-sm-12">
                  <fieldset>
                    <legend>Actions</legend>
                    <div className="flex-row">
                      {policyTriggers.map(action => (
                        <Field
                          key={action.name}
                          className="flex-4 flex-xs-12 flex-sm-6 flex-md-6"
                          id={action.name}
                          component={CheckboxForm}
                          label={action.name}
                          checked={!!selectedActions.find(a => a === action.name)}
                          name="properties.actions" // this is just a stub to change form touch state and is not used in the final form values
                          onChange={() => onActionChecked(action.name)}
                        />))}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </CardText>
          {(policyRuleUpdatePending || policyRulePending) && <LinearProgress id="policyRule-form" style={{ zIndex: 999 }} />}
          <CardActions>
            <Button
              flat
              label={cancelLabel}
              disabled={policyRulePending || submitting}
              component={Link}
              to={backLink}
            />
            <Button
              raised
              label={submitLabel}
              type="submit"
              disabled={pristine || lambdasDropDownPending || policyRulePending || invalid || submitting}
              primary
            />
          </CardActions>
        </Card>
      </div>
    </form>
  );
};

PolicyEventRuleForm.propTypes = {
  form: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleSelectedActions: PropTypes.func.isRequired,
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
  selectedActions: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
  fetchLambdasDropDown: PropTypes.func.isRequired,
  lambdasDropDown: PropTypes.array.isRequired,
  lambdasDropDownPending: PropTypes.bool.isRequired,
};

PolicyEventRuleForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
};

export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(PolicyEventRuleForm);
