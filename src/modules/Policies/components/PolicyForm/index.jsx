import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Field } from 'redux-form';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import PolicyRules from 'modules/PolicyRules';
import Breadcrumbs from 'modules/Breadcrumbs';
import { nameMaxLen } from '../../validations';

const PolicyForm = (props) => {
  const {
    params,
    pending,
    policy,
    policyRuleUpdatePending,
    onSubmit,
    invalid,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    editMode,
  } = props;

  return (
    <div>
      <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle
              title={
                <div>
                  <div>{title}</div>
                  <div className="md-caption"><Breadcrumbs /> / Policy</div>
                </div>
              }
              subtitle={policy.id}
            />
            <CardText>
              <div className="flex-row">
                <Field
                  className="flex-5 flex-xs-12"
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  maxLength={nameMaxLen}
                  autoComplete="none"
                />
                <Field
                  className="flex-7 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                />
              </div>
            </CardText>
            {(policyRuleUpdatePending || pending) && <LinearProgress id="policy-form" />}
            <CardActions>
              <Button
                flat
                label={cancelLabel}
                disabled={pending || submitting}
                component={Link}
                to={`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`}
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

          {(editMode && policy.id) &&
            <div className="flex-row center-center">
              <div className="flex-10 flex-xs-12 flex-sm-12">
                <PolicyRules {...props} />
              </div>
            </div>}
        </div>
      </form>
    </div>
  );
};

PolicyForm.propTypes = {
  params: PropTypes.object.isRequired,
  policy: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
  policyRuleUpdatePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
};

PolicyForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
};

export default PolicyForm;
