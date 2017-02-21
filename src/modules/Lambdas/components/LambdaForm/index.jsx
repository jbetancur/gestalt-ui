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
import { DetailCard, DetailCardTitle } from 'components/DetailCard';
import { BackArrowButton } from 'components/Buttons';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import Checkbox from 'components/Checkbox';
import AceEditor from 'components/AceEditor';
import { VariablesForm } from 'modules/Variables';
import runTimes from '../../lists/runTimes';
import acceptHeaders from '../../lists/acceptHeaders';
import { nameMaxLen, descriptionMaxLen } from '../../validations';

const LambdaForm = (props) => {
  // const themes = [{ displayName: 'chrome', value: 'chrome' }, { displayName: 'monokai', value: 'monokai' }];
  const { values, params, lambda, router: { location } } = props;

  const fetchProviders = () => {
    props.fetchProviders(params.fqon, params.environmentId, 'ApiGateway');
  };

  const getRuntime = () => runTimes.filter(runtime => runtime.value === values.properties.runtime)[0] || '';

  // const handleTheme = () => {
  //
  // };

  return (
    <div>
      <DetailCard>
        <DetailCardTitle>
          <BackArrowButton
            component={Link}
            to={`${props.params.fqon}/workspaces/${props.params.workspaceId}/environments/${props.params.environmentId}`}
          />
          <div className="gf-headline">{location.state.environment.description || location.state.environment.name} / Lambdas / {props.title}</div>
        </DetailCardTitle>
      </DetailCard>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle title={props.title} subtitle={lambda.id ? lambda.id : null} />
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
                  className="flex-5 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  maxLength={descriptionMaxLen}
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
                  min={0.1}
                  max={4.0}
                  step={0.1}
                  label="CPU"
                  type="number"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
                  parse={value => Number(value)}  // redux form formats everything as string, so force number
                />
                <Field
                  className="flex-1 flex-xs-12"
                  component={TextField}
                  name="properties.memory"
                  min={32}
                  max={8096}
                  step={1}
                  label="Memory"
                  type="number"
                  required
                  errorText={props.touched && props.error}
                  lineDirection="center"
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
                  errorText={props.touched && props.error}
                  lineDirection="center"
                  parse={value => Number(value)}  // redux form formats everything as string, so force number
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
                    // TODO: Find out why redux-form state for bool doesn't apply
                    checked={values.properties.compressed}
                  /> : null}
                <Field
                  className="flex-2 flex-xs-6"
                  id="synchronous"
                  component={Checkbox}
                  name="properties.synchronous"
                  // TODO: Find out why redux-form state for bool doesn't apply
                  checked={values.properties.synchronous}
                  label="Synchronous"
                />
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
                      maxLines={15}
                      minLines={15}
                      fontSize={14}
                    />
                  </div> : null}
              </div>
              <div className="flex-row">
                <div className="flex-12">
                  <VariablesForm {...props} />
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
  pendingProviders: PropTypes.bool.isRequired,
  lambdaUpdatePending: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  providers: PropTypes.array.isRequired,
  lambda: PropTypes.object.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
};

LambdaForm.defaultProps = {
  touched: false,
  error: false,
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
