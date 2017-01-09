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
import { nameMaxLen } from '../../validations';
import providerTypes from '../../lists/providerTypes';

const ProviderForm = (props) => {
  const { params, router, location } = props;

  const goBack = () => {
    if (params.workspaceId && !params.environmentId) {
      router.push(`${params.fqon}/workspaces/${params.workspaceId}`);
    } else if (params.workspaceId && params.environmentId) {
      router.push(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}?tabIndex=${location.query.tabIndex}`);
    } else {
      router.push(`${params.fqon}/providers`);
    }
  };

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle title={<span>{props.title}</span>} />
            <CardText>
              <div className="flex-row">
                <div className="flex-row">
                  <Field
                    id="select-provider"
                    className="flex-3 flex-xs-12"
                    component={SelectField}
                    name="resource_type"
                    menuItems={providerTypes}
                    itemLabel="name"
                    itemValue="value"
                    required
                    label="Provider Type"
                    errorText={props.touched && props.error}
                  />
                </div>
                <Field
                  className="flex-3 flex-xs-12"
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
                  className="flex-9 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  errorText={props.touched && props.error}
                  lineDirection="center"
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.config.url"
                  label="Provider URL/Host:Port"
                  type="text"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
                />
                <Field
                  id="select-return-type"
                  className="flex-2 flex-xs-12"
                  component={SelectField}
                  name="properties.config.auth.scheme"
                  menuItems={['Basic']}
                  required
                  label="Security Scheme"
                  errorText={props.touched && props.error}
                />
                <Field
                  className="flex-2 flex-xs-12"
                  component={TextField}
                  name="properties.config.auth.username"
                  label="Username"
                  type="text"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
                />
                <Field
                  className="flex-2 flex-xs-12"
                  component={TextField}
                  name="properties.config.auth.password"
                  label="Password"
                  type="text"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
                />
              </div>

            </CardText>
            {props.updatePending ? <LinearProgress id="user-form" /> : null}
            <CardActions>
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.pending || props.submitting}
                onClick={goBack}
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

ProviderForm.propTypes = {
  pending: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  updatePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string
};

ProviderForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel'
};

export default ProviderForm;
