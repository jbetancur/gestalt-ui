import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Field, getFormValues } from 'redux-form';
import { Link } from 'react-router';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Divider from 'react-md/lib/Dividers';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import MDSelectField from 'react-md/lib/SelectFields';
import Checkbox from 'components/Checkbox';
import AceEditor from 'components/AceEditor';
import { VariablesForm } from 'modules/Variables';
import Breadcrumbs from 'modules/Breadcrumbs';
// import { Scheduler } from 'modules/PeriodicScheduler';
import { CopyUUIDButton } from 'components/Buttons';
import runTimes from '../../lists/runTimes';
import acceptHeaders from '../../lists/acceptHeaders';
import { nameMaxLen, descriptionMaxLen } from '../../validations';

const timezones = moment.tz.names();

const LambdaForm = (props) => {
  const { values, params, lambda } = props;

  // TODO: Since we dont have ui specific props from the ui just use a lookup list for now
  const getRuntime = () => runTimes.find(runtime => runtime.value === values.properties.runtime) || '';

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle
              title={
                <div>
                  <div>{props.title}</div>
                  <div className="md-caption"><Breadcrumbs /> / Lambda</div>
                </div>
              }
              subtitle={lambda.id ? <CopyUUIDButton model={lambda} /> : null}
            />
            <CardText>
              <div className="flex-row">
                <Field
                  id="select-provider"
                  className="flex-4 flex-xs-12"
                  component={SelectField}
                  name="properties.provider.id"
                  required
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  menuItems={props.providers}
                  onFocus={() => props.fetchProvidersByType(props.params.fqon, params.environmentId, 'environments', 'Lambda')}
                  disabled={props.editMode}
                />
                <Field
                  id="select-runtime"
                  className="flex-3 flex-xs-12"
                  component={SelectField}
                  name="properties.runtime"
                  menuItems={props.executors}
                  itemLabel="name"
                  itemValue="runtime"
                  required
                  label="Runtime"
                  disabled={props.editMode}
                  onFocus={() => props.fetchExecutors(params.fqon, params.environmentId, 'environments', 'Executor')}
                />
                <Field
                  id="select-code-type"
                  className="flex-2 flex-xs-12"
                  component={SelectField}
                  name="properties.code_type"
                  menuItems={[{ displayName: 'Inline', value: 'code' }, { displayName: 'Package', value: 'package' }]}
                  itemLabel="displayName"
                  itemValue="value"
                  required
                  label="Code Type"
                  disabled={props.editMode}
                />
                <Field
                  id="select-return-type"
                  className="flex-3 flex-xs-12"
                  component={SelectField}
                  name="properties.headers.Accept"
                  menuItems={acceptHeaders}
                  itemLabel="displayName"
                  itemValue="value"
                  required
                  label="Accept Header"
                />
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
                  className="flex-5 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  maxLength={descriptionMaxLen}
                />
                <Field
                  className="flex-1 flex-xs-12"
                  component={TextField}
                  name="properties.cpus"
                  min={0.1}
                  max={4.0}
                  step={0.1}
                  label="CPU"
                  type="number"
                  required
                  parse={value => Number(value)}  // redux form formats everything as string, so force number
                />
                <Field
                  className="flex-1 flex-xs-12"
                  component={TextField}
                  name="properties.memory"
                  min={256}
                  max={2048}
                  step={256}
                  label="Memory"
                  type="number"
                  required
                  parse={value => Number(value)}  // redux form formats everything as string, so force number
                />
                <Field
                  className="flex-1 flex-xs-12"
                  component={TextField}
                  name="properties.timeout"
                  min={1}
                  step={1}
                  label="Timeout"
                  type="number"
                  required
                  parse={value => Number(value)}  // redux form formats everything as string, so force number
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.handler"
                  label="Handler"
                  helpText={getRuntime().format}
                  type="text"
                  required
                  disabled={props.editMode}
                />
                {values.properties.code_type === 'package' ?
                  <Field
                    className="flex-6 flex-xs-12"
                    component={TextField}
                    name="properties.package_url"
                    label="Package URL"
                    type="text"
                    required

                  /> : null}
                {values.properties.code_type === 'package' ?
                  <Field
                    className="flex-2 flex-xs-12"
                    id="compressed-packageurl"
                    component={Checkbox}
                    name="properties.compressed"
                    label="Compressed Package"
                    // TODO: Find out why redux-form state for bool doesn't apply
                    checked={values.properties.compressed}
                  /> : null}
                <Field
                  className="flex-2 flex-xs-6"
                  id="public"
                  component={Checkbox}
                  name="properties.public"
                  // TODO: Find out why redux-form state for bool doesn't apply
                  checked={values.properties.public}
                  label="Public"
                />

                {values.properties.code_type === 'code' ?
                  <div className="flex-row">
                    <MDSelectField
                      id="select-theme"
                      className="flex-2 flex-xs-12"
                      label="Editor Theme"
                      menuItems={['monokai', 'chrome']}
                      defaultValue={props.theme}
                      onChange={value => props.handleTheme(value)}
                    />
                    <Field
                      className="flex-12"
                      component={AceEditor}
                      mode={getRuntime().codeFormat}
                      theme={props.theme}
                      name="properties.code"
                      maxLines={50}
                      minLines={15}
                      fontSize={12}
                    />
                  </div> : null}
              </div>
              <h4>Periodic Configuration</h4>
              <Divider />
              <div className="flex-row">
                <Field
                  className="flex-3 flex-xs-12"
                  component={TextField}
                  name="properties.periodic_info.schedule"
                  label="Schedule"
                  helpText="Date and time format - ISO 8601"
                  type="text"
                />
                <Field
                  className="flex-3 flex-xs-12"
                  component={SelectField}
                  name="properties.periodic_info.timezone"
                  label="Timezone"
                  menuItems={timezones}
                />
                <Field
                  className="flex-3 flex-xs-12"
                  component={TextField}
                  name="properties.periodic_info.payload.eventName"
                  label="Event Name"
                  type="text"
                />
                <div className="flex-row">
                  <Field
                    className="flex-4 flex-xs-12"
                    component={TextField}
                    name="properties.periodic_info.payload.data"
                    label="json payload"
                    type="text"

                    rows={2}
                  />
                </div>
              </div>
              <Divider />
              {/* <div className="flex-row">
                <div className="flex-12">
                  <Scheduler />
                </div>
              </div> */}

              <div className="flex-row">
                <div className="flex-12">
                  <VariablesForm icon="list" {...props} />
                </div>
              </div>
            </CardText>
            {props.lambdaUpdatePending || props.pending ? <LinearProgress id="lambda-form" /> : null}
            <CardActions>
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.pending || props.submitting}
                component={Link}
                onClick={() => props.router.goBack()}
              />
              <Button
                raised
                label={props.submitLabel}
                type="submit"
                disabled={props.pristine || props.pending || props.lambdaUpdatePending || props.invalid || props.submitting}
                primary
              />
            </CardActions>
          </Card>
        </div>
      </form>
    </div>
  );
};

LambdaForm.propTypes = {
  router: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
  lambdaUpdatePending: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  providers: PropTypes.array.isRequired,
  fetchProvidersByType: PropTypes.func.isRequired,
  fetchExecutors: PropTypes.func.isRequired,
  handleTheme: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  executors: PropTypes.array.isRequired,
  lambda: PropTypes.object.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
};

LambdaForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(LambdaForm);
