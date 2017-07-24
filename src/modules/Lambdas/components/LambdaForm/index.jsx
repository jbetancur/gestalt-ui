import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Field, getFormValues } from 'redux-form';
import { Link } from 'react-router-dom';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import MDSelectField from 'react-md/lib/SelectFields';
import Checkbox from 'components/Checkbox';
import AceEditor from 'components/AceEditor';
import { VariablesForm } from 'modules/Variables';
import { Breadcrumbs } from 'modules/ContextManagement';
// import { Scheduler } from 'modules/PeriodicScheduler';
import { Button, CopyUUIDButton } from 'components/Buttons';
import runTimes from '../../lists/runTimes';
import acceptHeaders from '../../lists/acceptHeaders';
import { nameMaxLen, descriptionMaxLen } from '../../validations';

const timezones = moment.tz.names();

const LambdaForm = (props) => {
  const { values, match, lambda } = props;

  // TODO: Since we dont have ui specific props from the ui just use a lookup list for now
  const getRuntime = () => runTimes.find(runtime => runtime.value === values.properties.runtime) || '';

  // if doesn't support inline set back to package
  const handleSupportsInline = () => {
    const items = getRuntime().codeOptions;
    if (items && items.some(opt => opt.value !== 'code')) {
      props.dispatch(props.change('properties.code_type', 'package'));
    }
  };

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
              subtitle={
                lambda.id &&
                <div className="flex-row no-gutter">
                  <div className="flex-12">
                    <CopyUUIDButton model={lambda} />
                  </div>
                  <div className="flex-12">
                    <Button
                      label="Log"
                      to={{
                        pathname: '/logs',
                        search: `?name=${lambda.name}&fqon=${match.params.fqon}&providerId=${lambda.properties.provider.id}&logType=lambda&logId=${lambda.id}`
                      }}
                      target="_blank"
                      component={Link}
                      showUUID
                      flat
                    >subject
                    </Button>
                    <Button
                      label="Entitlements"
                      flat
                      onClick={() => props.showEntitlementsModal(props.title, props.match.params)}
                    >
                      security
                    </Button>
                  </div>
                </div>
              }
            />
            <CardText>
              <div className="flex-row">
                <Field
                  id="select-provider"
                  className="flex-4 flex-xs-12 flex-sm-6 flex-md-6"
                  component={SelectField}
                  name="properties.provider.id"
                  required
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  menuItems={props.providersByType}
                  async
                  onFocus={() => props.fetchProvidersByType(props.match.params.fqon, match.params.environmentId, 'environments', 'Lambda')}
                  disabled={props.editMode}
                />
                <Field
                  id="select-runtime"
                  className="flex-3 flex-xs-12 flex-sm-6 flex-md-6"
                  component={SelectField}
                  name="properties.runtime"
                  menuItems={props.executorsDropDown}
                  itemLabel="name"
                  itemValue="runtime"
                  required
                  label="Runtime"
                  async
                  onFocus={() => props.fetchExecutors(match.params.fqon, match.params.environmentId, 'environments', 'Executor')}
                  onChange={() => handleSupportsInline()}
                  disabled={props.editMode}
                />
                <Field
                  id="select-code-type"
                  className="flex-2 flex-xs-12 flex-sm-6 flex-md-6"
                  component={SelectField}
                  name="properties.code_type"
                  menuItems={getRuntime().codeOptions}
                  itemLabel="displayName"
                  itemValue="value"
                  required
                  label="Code Type"
                  disabled={props.editMode || !values.properties.runtime}
                />
                <Field
                  id="select-return-type"
                  className="flex-3 flex-xs-12 flex-sm-6 flex-md-6"
                  component={SelectField}
                  name="properties.headers.Accept"
                  menuItems={acceptHeaders}
                  itemLabel="displayName"
                  itemValue="value"
                  required
                  label="Accept Header"
                />
                <Field
                  className="flex-4 flex-xs-12 flex-sm-6 flex-md-6"
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  maxLength={nameMaxLen}
                />
                <Field
                  className="flex-5 flex-xs-12 flex-sm-6 flex-md-6"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  maxLength={descriptionMaxLen}
                />
                <Field
                  className="flex-1 flex-xs-4 flex-sm-4 flex-md-4"
                  component={TextField}
                  name="properties.cpus"
                  min={0.1}
                  max={4.0}
                  step={0.1}
                  label="CPU"
                  type="number"
                  required
                  parse={value => Number(value)} // redux form formats everything as string, so force number
                />
                <Field
                  className="flex-1 flex-xs-4 flex-sm-4 flex-md-4"
                  component={TextField}
                  name="properties.memory"
                  min={256}
                  max={2048}
                  step={256}
                  label="Memory"
                  type="number"
                  required
                  parse={value => Number(value)} // redux form formats everything as string, so force number
                />
                <Field
                  className="flex-1 flex-xs-4 flex-sm-4 flex-md-4"
                  component={TextField}
                  name="properties.timeout"
                  min={1}
                  step={1}
                  label="Timeout"
                  type="number"
                  required
                  parse={value => Number(value)} // redux form formats everything as string, so force number
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.handler"
                  label="Handler"
                  helpText={getRuntime().format}
                  type="text"
                  required
                />
                {values.properties.code_type === 'package' &&
                  <Field
                    className="flex-6 flex-xs-12 flex-sm-6 flex-md-6"
                    component={TextField}
                    name="properties.package_url"
                    label="Package URL"
                    type="text"
                    required

                  />}
                {values.properties.code_type === 'package' &&
                  <Field
                    className="flex-2 flex-xs-12 flex-sm-6 flex-md-6"
                    id="compressed-packageurl"
                    component={Checkbox}
                    name="properties.compressed"
                    label="Compressed Package"
                    // TODO: Find out why redux-form state for bool doesn't apply
                    checked={values.properties.compressed}
                  />}
                <Field
                  className="flex-2 flex-xs-6"
                  id="public"
                  component={Checkbox}
                  name="properties.public"
                  // TODO: Find out why redux-form state for bool doesn't apply
                  checked={values.properties.public}
                  label="Public"
                />

                {values.properties.code_type === 'code' &&
                  <div className="flex-row">
                    <MDSelectField
                      id="select-theme"
                      className="flex-2 flex-xs-12 flex-sm-6 flex-md-6"
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
                  </div>}
              </div>
              <fieldset>
                <legend>Periodic Configuration</legend>
                <div className="flex-row no-gutter">
                  <Field
                    className="flex-3 flex-xs-12 flex-sm-6 flex-md-6"
                    component={TextField}
                    name="properties.periodic_info.schedule"
                    label="Schedule"
                    helpText="Date and time format - ISO 8601"
                    type="text"
                  />
                  <Field
                    id="periodic-timezone"
                    className="flex-3 flex-xs-12 flex-sm-6 flex-md-6"
                    component={SelectField}
                    name="properties.periodic_info.timezone"
                    label="Timezone"
                    menuItems={timezones}
                  />
                  <Field
                    className="flex-3 flex-xs-12 flex-sm-6 flex-md-6"
                    component={TextField}
                    name="properties.periodic_info.payload.eventName"
                    label="Event Name"
                    type="text"
                  />
                  <div className="flex-row">
                    <Field
                      className="flex-6 flex-xs-12 flex-sm-6 flex-md-6"
                      component={TextField}
                      name="properties.periodic_info.payload.data"
                      label="json payload"
                      type="text"
                      rows={2}
                    />
                  </div>
                </div>
              </fieldset>

              <div className="flex-row no-gutter">
                <div className="flex">
                  <fieldset>
                    <legend>Environment Variables</legend>
                    <VariablesForm icon="add" fieldName="properties.env" {...props} />
                  </fieldset>
                </div>
              </div>
            </CardText>
            {(props.lambdaUpdatePending || props.lambdaPending) && <LinearProgress id="lambda-form" />}
            <CardActions className="flex-row no-gutter">
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.lambdaPending || props.submitting}
                onClick={() => props.history.goBack()}
              />
              <Button
                raised
                label={props.submitLabel}
                type="submit"
                disabled={props.pristine || props.lambdaPending || props.lambdaUpdatePending || props.invalid || props.submitting}
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
  history: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  lambdaPending: PropTypes.bool.isRequired,
  lambdaUpdatePending: PropTypes.bool,
  match: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  providersByType: PropTypes.array.isRequired,
  fetchProvidersByType: PropTypes.func.isRequired,
  fetchExecutors: PropTypes.func.isRequired,
  handleTheme: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  executorsDropDown: PropTypes.array.isRequired,
  lambda: PropTypes.object.isRequired,
  showEntitlementsModal: PropTypes.func.isRequired,
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
  lambdaUpdatePending: false,
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(LambdaForm);
