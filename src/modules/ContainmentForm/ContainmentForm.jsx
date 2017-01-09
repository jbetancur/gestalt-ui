import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Toolbar from 'react-md/lib/Toolbars';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { VariablesForm } from 'modules/Variables';
import { nameMaxLen, descriptionMaxLen } from './validations';

const ContainmentForm = (props) => {
  const goBack = () => {
    props.router.goBack();
  };

  return (
    <div>
      <Toolbar
        themed
        title={<span>{props.title}</span>}
      />
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
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
                />
                <Field
                  className="flex-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  rows={2}
                  maxRows={4}
                  maxLength={descriptionMaxLen}
                  lineDirection="center"
                />
                {props.isEnvironment ? <Field
                  id="environment-type"
                  className="flex-6 flex-xs-12"
                  component={SelectField}
                  name="properties.environment_type"
                  menuItems={['development', 'test', 'production']}
                  required
                  label="Environment Type"
                  errorText={props.touched && props.error}
                /> : null}
              </div>
              <VariablesForm envMap={props.envMap} />
            </CardText>
            {props.pending ? <LinearProgress id="containment-form" /> : null}
            <CardActions>
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.pending || props.submitting}
                onClick={() => goBack()}
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

ContainmentForm.propTypes = {
  pending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  envMap: PropTypes.object,
  isEnvironment: PropTypes.bool
};

ContainmentForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  isEnvironment: false,
  envMap: {}
};

export default ContainmentForm;
