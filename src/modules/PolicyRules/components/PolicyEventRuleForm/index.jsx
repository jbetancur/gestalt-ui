import React, { PropTypes } from 'react';
import { Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
// import SelectField from 'components/SelectField';
import TextField from 'components/TextField';
import CheckboxForm from 'components/Checkbox';
import { nameMaxLen } from './validations';
import policyResourceTypes from '../../lists/policyResourceTypes';

const PolicyEventRuleForm = (props) => {
  const {
    params,
    pending,
    policyUpdatePending,
    onSubmit,
    touched,
    error,
    invalid,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    selectedActions,
    editMode,
    lambdas,
    // pendingLambdas,
  } = props;

  // const fetchLambdas = () => {
  //   props.fetchLambdas(params.fqon, params.environmentId);
  // };

  const policyTriggers = [].concat(...Object.keys(policyResourceTypes).map(key => policyResourceTypes[key].triggers));

  const onActionChecked = (action) => {
    props.handleSelectedActions(action, selectedActions);
  };

  return (
    <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="flex-row center-center">
        <Card className="flex-10 flex-xs-12 flex-sm-12">
          <CardTitle title={title} />
          <CardText>
            <div className="flex-row">
              <Field
                className="flex-4 flex-xs-12"
                component={TextField}
                name="name"
                label="Name"
                type="text"
                required
                errorText={touched && error}
                maxLength={nameMaxLen}
                lineDirection="center"
              />
              <Field
                className="flex-8 flex-xs-12"
                component={TextField}
                menuItems={lambdas}
                name="description"
                label="Description"
                type="text"
                lineDirection="center"
              />
              <Field
                className="flex-4 flex-xs-12"
                component={TextField}
                name={editMode ? 'properties.lambda.id' : 'properties.lambda'}
                label="Lambda UUID"
                type="text"
                required
                errorText={touched && error}
                lineDirection="center"
              />
              {/* <Field
                className="flex-4 flex-xs-12"
                component={SelectField}
                name={editMode ? 'properties.lambda.id' : 'properties.lambda'}
                label="Lambda"
                menuItems={pendingLambdas ? ['fetching lambdas...'] : lambdas}
                itemLabel="name"
                itemValue="id"
                type="text"
                required
                lineDirection="center"
                errorText={touched && error}
                onFocus={() => fetchLambdas()}
              /> */}
              <fieldset>
                <legend>Actions</legend>
                <div className="flex-row">
                  {policyTriggers.map(action =>
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
                pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/policies/${params.policyId}/edit`,
                state: { environment: props.router.location.state.environment },
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

PolicyEventRuleForm.propTypes = {
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
  policyUpdatePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  lambdas: PropTypes.object.isRequired,
  // pendingLambdas: PropTypes.bool.isRequired,
  selectedActions: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
};

PolicyEventRuleForm.defaultProps = {
  touched: false,
  error: false,
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
