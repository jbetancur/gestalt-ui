import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import JSONTree from 'components/JSONTree';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { nameMaxLen } from '../../validations';
import providerTypes from '../../lists/providerTypes';

const ProviderForm = (props) => {
  const { params, router, location, provider, selectedProviderType } = props;

  const goBack = () => {
    if (params.workspaceId && !params.environmentId) {
      router.push(`${params.fqon}/workspaces/${params.workspaceId}`);
    } else if (params.workspaceId && params.environmentId) {
      router.push(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}?tabIndex=${location.query.tabIndex}`);
    } else {
      router.push(`${params.fqon}/providers`);
    }
  };

  const updateForm = (value) => {
    props.handleProviderType(value);
  };

  const renderJSONSection = () => (
    <div className="flex-row">
      <div className="flex-6 flex-xs-12">
        {!props.provider.properties.config.networks ? null :
        <JSONTree
          data={props.provider.properties.config.networks}
        />}
      </div>
      <div className="flex-6 flex-xs-12">
        {!props.provider.properties.config.extra ? null :
        <JSONTree
          data={props.provider.properties.config.extra}
        />}
      </div>
    </div >
  );

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12 flex-md-12">
            <CardTitle title={<span>{props.title}</span>} />
            <CardText>
              <div className="flex-row">
                <div className="flex-row">
                  <Field
                    id="select-provider"
                    className="flex-3 flex-xs-12 flex-sm-6"
                    component={SelectField}
                    name="resource_type"
                    menuItems={providerTypes}
                    itemLabel="name"
                    itemValue="value"
                    required
                    label="Provider Type"
                    errorText={props.touched && props.error}
                    onChange={(v, value) => updateForm(value)}
                    disabled={provider.id}
                  />
                  <Field
                    className="flex-3 flex-xs-12 flex-sm-6"
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
                    className="flex-6 flex-xs-12 flex-sm-12"
                    component={TextField}
                    name="description"
                    label="Description"
                    type="text"
                    errorText={props.touched && props.error}
                    lineDirection="center"
                  />
                </div>
                <Field
                  className="flex-6 flex-xs-12 flex-sm-12"
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
                  className="flex-2 flex-xs-12 flex-sm-4"
                  component={SelectField}
                  name="properties.config.auth.scheme"
                  menuItems={['Basic']}
                  required
                  label="Security Scheme"
                  errorText={props.touched && props.error}
                />
                <Field
                  className="flex-2 flex-xs-12 flex-sm-4"
                  component={TextField}
                  name="properties.config.auth.username"
                  label="Username"
                  type="text"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
                />
                <Field
                  className="flex-2 flex-xs-12 flex-sm-4"
                  component={TextField}
                  name="properties.config.auth.password"
                  label="Password"
                  type="password"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
                />
                {selectedProviderType === 'container' || provider.properties.config.networks ?
                  <Field
                    className="flex-6 flex-xs-12"
                    component={TextField}
                    name="properties.config.networks"
                    label="Networks (JSON)"
                    type="text"
                    errorText={props.touched && props.error}
                    lineDirection="center"
                    rows={2}
                  /> : null}
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.config.extra"
                  label="Extra Configuration (JSON)"
                  type="text"
                  errorText={props.touched && props.error}
                  lineDirection="center"
                  rows={2}
                />

                {provider.id ? renderJSONSection() : null}
              </div>
            </CardText>
            {props.updatePending || props.pending ? <LinearProgress id="user-form" /> : null}
            <CardActions>
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.updatePending || props.pending || props.submitting}
                onClick={goBack}
              />
              <Button
                raised
                label={props.submitLabel}
                type="submit"
                disabled={props.pristine || props.updatePending || props.pending || props.invalid || props.submitting}
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
  provider: PropTypes.object,
  selectedProviderType: PropTypes.string,
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
  cancelLabel: 'Cancel',
  provider: {},
  selectedProviderType: ''
};

export default ProviderForm;
