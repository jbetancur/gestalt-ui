import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FileInput from 'react-md/lib/FileInputs';
import AceEditor from 'components/AceEditor';
import JSONTree from 'components/JSONTree';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { nameMaxLen } from '../../validations';
import providerTypes from '../../lists/providerTypes';

const ProviderForm = (props) => {
  const { provider, change, reset, values } = props;
  const selectedProviderType = providerTypes.find(type => type.value === values.resource_type) || {};

  const goBack = () => {
    props.router.goBack();
    // if (params.workspaceId && !params.environmentId) {
    //   router.push(`${params.fqon}/workspaces/${params.workspaceId}`);
    // } else if (params.workspaceId && params.environmentId) {
    //   router.push(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`);
    // } else {
    //   router.push(`${params.fqon}/providers`);
    // }
  };

  const onFile = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      props.dispatch(change('properties.data', reader.result));
    };

    reader.readAsText(file);
  };

  const renderJSONSection = () => (
    <div className="flex-row">
      {!selectedProviderType.networking ? null : <div className="flex-6 flex-xs-12">
        <JSONTree
          data={props.provider.properties.config.networks}
        />
      </div>}
      {!selectedProviderType.extraConfig ? null : <div className="flex-6 flex-xs-12">
        <JSONTree
          data={props.provider.properties.config.extra}
        />
      </div>}
    </div>
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
                    disabled={!!provider.id}
                    onChange={() => reset()}
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
                {selectedProviderType.url ?
                  <Field
                    className="flex-6 flex-xs-12 flex-sm-12"
                    component={TextField}
                    name="properties.config.url"
                    label="Provider URL/Host:Port"
                    type="text"
                    required
                    errorText={props.touched && props.error}
                    lineDirection="center"
                  /> : null}
                {selectedProviderType.auth ?
                  <Field
                    id="select-return-type"
                    className="flex-2 flex-xs-12 flex-sm-4"
                    component={SelectField}
                    name="properties.config.auth.scheme"
                    menuItems={['Basic']}
                    required
                    label="Security Scheme"
                    errorText={props.touched && props.error}
                  /> : null}
                {selectedProviderType.auth ?
                  <Field
                    className="flex-2 flex-xs-12 flex-sm-4"
                    component={TextField}
                    name="properties.config.auth.username"
                    label="Username"
                    type="text"
                    required
                    errorText={props.touched && props.error}
                    lineDirection="center"
                  /> : null}
                {selectedProviderType.auth ?
                  <Field
                    className="flex-2 flex-xs-12 flex-sm-4"
                    component={TextField}
                    name="properties.config.auth.password"
                    label="Password"
                    type="password"
                    required
                    errorText={props.touched && props.error}
                    lineDirection="center"
                  /> : null}
                {selectedProviderType.networking ?
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
                {selectedProviderType.extraConfig ?
                  <Field
                    className="flex-6 flex-xs-12"
                    component={TextField}
                    name="properties.config.extra"
                    label="Extra Configuration (JSON)"
                    type="text"
                    errorText={props.touched && props.error}
                    lineDirection="center"
                    rows={2}
                  /> : null}

                {provider.id ? renderJSONSection() : null}

                {selectedProviderType.uploadConfig ?
                  <FileInput
                    id="imageInput1"
                    label="Upload YAML"
                    onChange={(file, e) => onFile(file, e)}
                    accept="application/x-yaml"  // The IANA MIME types registry doesn't list YAML yet, so there isn't a correct one, per se.
                    primary
                  /> : null}
                {selectedProviderType.uploadConfig ?
                  <div className="flex-row">
                    <Field
                      className="flex-12"
                      component={AceEditor}
                      mode="yaml"
                      theme="chrome"
                      name="properties.data"
                      minLines={15}
                      maxLines={15}
                      helpText="test"
                    />
                  </div> : null}
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
  change: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  provider: PropTypes.object,
  updatePending: PropTypes.bool.isRequired,
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
  values: PropTypes.object.isRequired,
};

ProviderForm.defaultProps = {
  touched: false,
  error: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  provider: {},
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(ProviderForm);
