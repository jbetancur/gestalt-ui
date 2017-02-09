import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import { Link } from 'react-router';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/java';
import 'brace/mode/csharp';
import 'brace/mode/golang';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/theme/chrome';
import 'brace/theme/monokai';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import Checkbox from 'components/Checkbox';
import { VariablesForm } from 'modules/Variables';
import runTimes from '../../lists/runTimes';
import acceptHeaders from '../../lists/acceptHeaders';
import { nameMaxLen } from '../../validations';

const LambdaForm = (props) => {
  // const themes = [{ displayName: 'chrome', value: 'chrome' }, { displayName: 'monokai', value: 'monokai' }];
  const { values, params } = props;

  const fetchProviders = () => {
    props.fetchProviders(params.fqon, params.environmentId, 'ApiGateway');
  };

  const getRuntime = () => runTimes.filter(runtime => runtime.value === values.properties.runtime)[0] || '';

  // const handleTheme = () => {
  //
  // };

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle title={props.title} />
            <CardText>
              <div className="flex-row">
                <Field
                  id="select-provider"
                  className="flex-4 flex-xs-12"
                  component={SelectField}
                  name="properties.providers"
                  required
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  errorText={props.touched && props.error}
                  menuItems={props.pendingProviders ? ['fetching providers...'] : props.providers}
                  onFocus={() => fetchProviders()}
                />
                <Field
                  className="flex-4 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Name"
                  type="text"
                  required
                  errorText={props.touched && props.error}
                  maxLength={nameMaxLen}
                  lineDirection="center"
                />
                <Field
                  className="flex-4 flex-xs-12"
                  component={TextField}
                  name="name"
                  label="Short Name"
                  type="text"
                  required
                  errorText={props.touched && props.error}
                  maxLength={nameMaxLen}
                  lineDirection="center"
                />
                <Field
                  id="select-runtime"
                  className="flex-2 flex-xs-12"
                  component={SelectField}
                  name="properties.runtime"
                  menuItems={runTimes}
                  itemLabel="displayName"
                  itemValue="value"
                  required
                  label="Runtime"
                  errorText={props.touched && props.error}
                  disabled={props.editMode}
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
                  errorText={props.touched && props.error}
                  disabled={props.editMode}
                />
                <Field
                  id="select-return-type"
                  className="flex-4 flex-xs-12"
                  component={SelectField}
                  name="properties.headers.Accept"
                  menuItems={acceptHeaders}
                  itemLabel="displayName"
                  itemValue="value"
                  required
                  label="Accept Header"
                  errorText={props.touched && props.error}
                />
                <Field
                  className="flex-1 flex-xs-12"
                  component={TextField}
                  name="properties.cpus"
                  min="0.1"
                  max="4.0"
                  step="0.1"
                  label="CPU"
                  type="number"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
                />
                <Field
                  className="flex-1 flex-xs-12"
                  component={TextField}
                  name="properties.memory"
                  min="32"
                  max="8096"
                  step="1"
                  label="Memory"
                  type="number"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
                />
                <Field
                  className="flex-1 flex-xs-12"
                  component={TextField}
                  name="properties.timeout"
                  label="Timeout"
                  type="number"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.handler"
                  label="Handler"
                  placeholder={getRuntime().format}
                  helpText={getRuntime().format}
                  type="text"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
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
                    errorText={props.touched && props.error}
                    lineDirection="center"
                  /> : null}
                {values.properties.code_type === 'package' ?
                  <Field
                    className="flex-2 flex-xs-12"
                    id="compressed-packageurl"
                    component={Checkbox}
                    name="properties.compressed"
                    label="Compressed Package"
                  /> : null}
                <Field
                  className="flex-2 flex-xs-6"
                  id="synchronous"
                  component={Checkbox}
                  name="properties.synchronous"
                  defaultChecked
                  label="Synchronous"
                />
                <Field
                  className="flex-2 flex-xs-6"
                  id="public"
                  component={Checkbox}
                  name="properties.public"
                  defaultChecked
                  label="Public"
                />
                {values.properties.code_type === 'code' ?
                  <div className="flex-row">
                    {/* <Field
                      id="select-theme"
                      className="flex-2 flex-xs-12"
                      component={SelectField}
                      menuItems={themes}
                      itemLabel="displayName"
                      itemValue="value"
                      defaultValue="chrome"
                      onChange={(p, n) => handleTheme(n)}
                    /> */}
                    <Field
                      className="flex-12"
                      component={AceEditor}
                      mode={getRuntime().codeFormat}
                      theme="chrome"
                      name="properties.code"
                      width="100%"
                      height="100%"
                      maxLines={15}
                      minLines={15}
                      fontSize={14}
                      wrapEnabled
                      editorProps={{ $blockScrolling: Infinity }}
                    />
                  </div> : null}
              </div>
              <div className="flex-row">
                <div className="flex-12">
                  <VariablesForm {...props} />
                </div>
              </div>
            </CardText>
            {props.lambdaUpdatePending ? <LinearProgress id="lambda-form" /> : null}
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
  values: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
  pendingProviders: PropTypes.bool.isRequired,
  lambdaUpdatePending: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string2,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
  providers: PropTypes.array.isRequired,
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
