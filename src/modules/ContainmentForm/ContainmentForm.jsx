import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { VariablesForm } from 'modules/Variables';
import Breadcrumbs from 'modules/Breadcrumbs';
import { nameMaxLen, shortNameMaxLen } from './validations';

const ContainmentForm = (props) => {
  const goBack = () => {
    props.router.goBack();
  };

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-8 flex-xs-12 flex-sm-12">
            <CardTitle
              title={
                <div>
                  <div>{props.title}</div>
                  <div className="md-caption"><Breadcrumbs /></div>
                </div>
              }
            />
            <CardText>
              <div className="flex-row">
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Name"
                  type="text"
                  maxLength={nameMaxLen}
                  lineDirection="center"
                  required
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="name"
                  label="Short Name"
                  type="text"
                  errorText={props.touched && props.error}
                  maxLength={shortNameMaxLen}
                  lineDirection="center"
                  required
                  helpText="allowed characters (a-z A-Z 0-9  - )"
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
              <VariablesForm icon="list" envMap={props.envMap} />
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
  router: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
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
  envMap: PropTypes.object,
  isEnvironment: PropTypes.bool,
};

ContainmentForm.defaultProps = {
  touched: false,
  error: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  isEnvironment: false,
  envMap: {},
};

export default ContainmentForm;
