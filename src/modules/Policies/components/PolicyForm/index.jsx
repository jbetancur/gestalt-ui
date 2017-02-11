import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Field } from 'redux-form';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from 'components/TextField';
import { nameMaxLen } from '../../validations';

const PolicyForm = (props) => {
  // const {
  //   editMode,
  //   policy,
  //   updatedPolicy
  // } = props;


  // const currentPolicy = editMode && updatedPolicy.id ? updatedPolicy : policy;

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle title={<span>{props.title}</span>} />
            <CardText>
              <div className="flex-row">
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  errorText={props.touched && props.error}
                  maxLength={nameMaxLen}
                  lineDirection="center"
                  autoComplete="none"
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  lineDirection="center"
                />
              </div>
            </CardText>
            {props.policyUpdatePending || props.pending ? <LinearProgress id="policy-form" style={{ zIndex: 999 }} /> : null}
            <CardActions>
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.pending || props.submitting}
                component={Link}
                to={`${props.params.fqon}/workspaces/${props.params.workspaceId}/environments/${props.params.environmentId}`}
              />
              <Button
                raised
                label={props.submitLabel}
                type="submit"
                disabled={props.pristine || props.pending || props.invalid || props.submitting}
                primary
              />
            </CardActions>
          </Card>
        </div>
      </form>
    </div>
  );
};

PolicyForm.propTypes = {
  // policy: PropTypes.object.isRequired,
  // updatedPolicy: PropTypes.object.isRequired,
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
  // editMode: PropTypes.bool,
};

PolicyForm.defaultProps = {
  touched: false,
  error: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
};

export default PolicyForm;
