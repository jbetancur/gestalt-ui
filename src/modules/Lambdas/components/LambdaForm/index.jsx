import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
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
import ActionsToolbar from 'components/ActionsToolbar';
import { VariablesForm } from 'modules/Variables';
import { Button } from 'components/Buttons';
import Fieldset from 'components/Fieldset';
import DetailsPane from 'components/DetailsPane';
import { isUnixVariable } from 'util/validations';
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
      {lambda.id &&
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12}>
            <DetailsPane model={lambda} />
          </Col>
        </Row>}
      <form
        onSubmit={props.handleSubmit(props.onSubmit)}
        autoComplete="off"
      >
        <Row gutter={5} center>
          <Col component={Card} flex={10} xs={12} sm={12}>
            <CardTitle
              title={props.title}
            />
            {lambda.id &&
              <ActionsToolbar>
                <Row>
                  <Col flex={12}>
                    <Button
                      flat
                      iconChildren="subject"
                      to={{
                        pathname: '/logs',
                        search: `?name=${lambda.name}&fqon=${match.params.fqon}&providerId=${lambda.properties.provider.id}&logType=lambda&logId=${lambda.id}`
                      }}
                      target="_blank"
                      component={Link}
                      showUUID
                    >
                      View Log
                    </Button>
                    <Button
                      flat
                      iconChildren="security"
                      onClick={() => props.showEntitlementsModal(props.title, props.match.params)}
                    >
                      Entitlements
                    </Button>
                  </Col>
                </Row>
              </ActionsToolbar>}
            <CardText>
              <Row gutter={5}>
                <div className="flex-12 flex-xs-12 flex-sm-12 flex-md-12 flex-row start-start">
                  <Field
                    id="select-provider"
                    className="flex-6 flex-xs-12 flex-sm-12"
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
                    className="flex-6 flex-xs-12 flex-sm-12"
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
                    className="flex-6 flex-xs-12 flex-sm-12"
                    component={TextField}
                    name="name"
                    label="Lambda Name"
                    type="text"
                    required
                    maxLength={nameMaxLen}
                  />
                  <Field
                    className="flex-6 flex-xs-12 flex-sm-12"
                    component={TextField}
                    name="description"
                    label="Description"
                    type="text"
                    rows={1}
                    maxLength={descriptionMaxLen}
                  />

                  {values.properties.runtime &&
                    <div className="flex-12 flex-xs-12 flex-sm-12 flex-md-12 flex-row start-start no-gutter">
                      <Field
                        className="flex-6 flex-xs-12 flex-sm-12"
                        component={TextField}
                        name="properties.handler"
                        label="Handler"
                        helpText={getRuntime().format}
                        type="text"
                        required
                      />
                      <Field
                        id="select-return-type"
                        className="flex-2 flex-xs-12 flex-sm-12"
                        component={SelectField}
                        name="properties.headers.Accept"
                        menuItems={acceptHeaders}
                        itemLabel="displayName"
                        itemValue="value"
                        required
                        label="Accept Header"
                      />
                      <Field
                        className="flex-1 flex-xs-6 flex-sm-6"
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
                        className="flex-1 flex-xs-6 flex-sm-6"
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
                        className="flex-1 flex-xs-6 flex-sm-6"
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
                        className="flex-1 flex-xs-6 flex-sm-6"
                        id="public"
                        component={Checkbox}
                        name="properties.public"
                        // TODO: Find out why redux-form state for bool doesn't apply
                        checked={values.properties.public}
                        label="Make Public"
                      />

                      <Fieldset legend="Lambda Function">
                        <div className="flex-row">
                          <Field
                            id="select-code-type"
                            className="flex-2 flex-xs-12 flex-sm-12"
                            component={SelectField}
                            name="properties.code_type"
                            menuItems={getRuntime().codeOptions}
                            itemLabel="displayName"
                            itemValue="value"
                            required
                            label="Code Type"
                            disabled={props.editMode || !values.properties.runtime}
                          />

                          {values.properties.code_type === 'code' &&
                            <MDSelectField
                              id="select-code-theme"
                              className="flex-2 flex-xs-12 flex-sm-6 flex-md-6"
                              label="Editor Theme"
                              menuItems={['monokai', 'chrome']}
                              defaultValue={props.theme}
                              onChange={value => props.handleTheme(value)}
                            />}
                          {values.properties.code_type === 'code' &&

                            <Field
                              className="flex-12"
                              component={AceEditor}
                              mode={getRuntime().codeFormat}
                              theme={props.theme}
                              name="properties.code"
                              maxLines={75}
                              minLines={25}
                              fontSize={12}
                            />}

                          {values.properties.code_type === 'package' &&
                            <Field
                              className="flex-8 flex-xs-12 flex-sm-12"
                              component={TextField}
                              name="properties.package_url"
                              label="Package URL"
                              type="text"
                              required
                            />}
                          {values.properties.code_type === 'package' &&
                            <Field
                              className="flex-2 flex-xs-12 flex-sm-12"
                              id="compressed-packageurl"
                              component={Checkbox}
                              name="properties.compressed"
                              label="Compressed Package"
                              // TODO: Find out why redux-form state for bool doesn't apply
                              checked={values.properties.compressed}
                            />}
                        </div>
                      </Fieldset>
                    </div>}

                  <div className="flex-row flex-6 flex-xs-12 flex-sm-12">
                    <Fieldset legend="Environment Variables" style={{ minHeight: '16em' }}>
                      <VariablesForm
                        className="flex-row"
                        icon="add"
                        fieldName="properties.env"
                        keyFieldValidationFunction={isUnixVariable}
                        keyFieldValidationMessage="must be a unix variable name"
                        {...props}
                      />
                    </Fieldset>
                  </div>
                  <div className="flex-row flex-6 flex-xs-12 flex-sm-12">
                    <Fieldset legend="Periodic Configuration" style={{ minHeight: '16em' }}>
                      <div className="flex-row">
                        <Field
                          className="flex-4 flex-xs-12 flex-sm-12 flex-md-6"
                          component={TextField}
                          name="properties.periodic_info.schedule"
                          label="Schedule"
                          helpText="Date and time format - ISO 8601"
                          type="text"
                        />
                        <Field
                          id="periodic-timezone"
                          className="flex-4 flex-xs-12 flex-sm-12 flex-md-6"
                          component={SelectField}
                          name="properties.periodic_info.timezone"
                          label="Timezone"
                          menuItems={timezones}
                        />
                        <Field
                          className="flex-4 flex-xs-12 flex-sm-12 flex-md-12"
                          component={TextField}
                          name="properties.periodic_info.payload.eventName"
                          label="Event Name"
                          type="text"
                        />
                        <div className="flex-row">
                          <Field
                            className="flex-12 flex-xs-12 flex-sm-12 flex-md-12"
                            component={TextField}
                            name="properties.periodic_info.payload.data"
                            label="json payload"
                            type="text"
                            rows={2}
                          />
                        </div>
                      </div>
                    </Fieldset>
                  </div>
                </div>
              </Row>
            </CardText>
            {props.lambdaPending && <LinearProgress id="lambda-form" />}
            <CardActions>
              <Button
                flat
                disabled={props.lambdaPending || props.submitting}
                onClick={() => props.history.goBack()}
              >
                {props.cancelLabel}
              </Button>
              <Button
                raised
                type="submit"
                disabled={props.pristine || props.lambdaPending || props.invalid || props.submitting}
                primary
              >
                {props.submitLabel}
              </Button>
            </CardActions>
          </Col>
        </Row>
      </form>
    </div>
  );
};

LambdaForm.propTypes = {
  history: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  lambdaPending: PropTypes.bool.isRequired,
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
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(LambdaForm);
