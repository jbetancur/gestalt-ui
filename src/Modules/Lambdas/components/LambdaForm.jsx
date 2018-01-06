import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Field, FieldArray, getFormValues } from 'redux-form';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardText, LinearProgress, SelectField as MDSelectField } from 'react-md';
import { Checkbox, SelectField, TextField } from 'components/ReduxFormFields';
import AceEditor from 'components/AceEditor';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import A from 'components/A';
import { Caption } from 'components/Typography';
import { UnixVariablesForm } from 'Modules/Variables';
import { ActionsMenu } from 'Modules/Actions';
import runTimes from '../lists/runTimes';
import acceptHeaders from '../lists/acceptHeaders';
import { nameMaxLen, descriptionMaxLen } from '../validations';

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
          <Col flex={10} xs={12} sm={12} md={12}>
            <DetailsPane model={lambda} />
          </Col>
        </Row>}
      <form
        onSubmit={props.handleSubmit(props.onSubmit)}
        autoComplete="off"
      >
        <Row gutter={5} center>
          <Col component={Card} flex={10} xs={12} sm={12} md={12}>
            <CardTitle
              title={props.title}
            />
            <ActionsToolbar>
              <Row>
                <Col flex={12}>
                  <Button
                    flat
                    iconChildren="arrow_back"
                    disabled={props.lambdaPending || props.submitting}
                    component={Link}
                    to={`/${props.match.params.fqon}/hierarchy/${props.match.params.workspaceId}/environment/${props.match.params.environmentId}/lambdas`}
                  >
                    {props.cancelLabel}
                  </Button>
                  <Button
                    raised
                    iconChildren="save"
                    type="submit"
                    disabled={props.pristine || props.lambdaPending || props.invalid || props.submitting}
                    primary
                  >
                    {props.submitLabel}
                  </Button>
                  {lambda.id &&
                    [
                      <Button
                        key="lambda--log"
                        flat
                        iconChildren="subject"
                        to={{
                          pathname: '/logs',
                          search: `?name=${lambda.name}&fqon=${match.params.fqon}&providerId=${lambda.properties.provider.id}&logType=lambda&logId=${lambda.id}`
                        }}
                        target="_blank"
                        component={Link}
                      >
                        View Log
                      </Button>,
                      <ActionsMenu
                        key="lambda--actions"
                        model={props.lambda}
                        actionList={props.actions}
                        pending={props.actionsPending}
                      />,
                      <Button
                        key="lambda--entitlements"
                        flat
                        iconChildren="security"
                        onClick={() => props.showEntitlementsModal(props.title, props.match.params)}
                      >
                          Entitlements
                      </Button>
                    ]}
                </Col>
              </Row>
            </ActionsToolbar>
            {props.lambdaPending && <LinearProgress id="lambda-form" />}

            <CardText>
              <Row gutter={5}>
                <Col flex={6} xs={12} sm={12}>
                  <Field
                    id="select-provider"
                    component={SelectField}
                    name="properties.provider.id"
                    required
                    label="Lambda Provider"
                    itemLabel="name"
                    itemValue="id"
                    menuItems={props.providersByType}
                    async
                    disabled={props.editMode}
                  />
                </Col>
                <Col flex={6} xs={12} sm={12}>
                  <Field
                    component={TextField}
                    name="name"
                    label="Lambda Name"
                    type="text"
                    required
                    maxLength={nameMaxLen}
                  />
                </Col>
              </Row>

              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Description" defaultExpanded={!!lambda.description}>
                    <Field
                      component={TextField}
                      name="description"
                      placeholder="Description"
                      type="text"
                      rows={1}
                      maxLength={descriptionMaxLen}
                    />
                  </Panel>
                </Col>

                {props.editMode &&
                <Col flex={12}>
                  <Panel title="Public Endpoints" pending={props.apiEndpointsPending}>
                    {props.apiEndpoints.map(a => <A href={a.properties.public_url} target="_blank" rel="noopener noreferrer" block>{a.properties.public_url}</A>)}
                    {!props.apiEndpoints.length > 0 && !props.apiEndpointsPending && <Caption light large>No Public Endpoints Configured</Caption> }
                  </Panel>
                </Col>}

                <Col flex={12}>
                  <Panel title="Lambda Function">
                    <Row gutter={5}>
                      <Col flex={4} xs={12} sm={12}>
                        <Field
                          id="select-runtime"
                          component={SelectField}
                          name="properties.runtime"
                          menuItems={props.executorsDropDown}
                          itemLabel="name"
                          itemValue="runtime"
                          required
                          label="Runtime"
                          async
                          onChange={handleSupportsInline}
                          disabled={props.editMode}
                        />
                      </Col>
                      <Col flex={2} xs={12} sm={12}>
                        <Field
                          id="select-code-type"
                          component={SelectField}
                          name="properties.code_type"
                          menuItems={getRuntime().codeOptions || [{ displayName: 'Package', value: 'package' }]}
                          itemLabel="displayName"
                          itemValue="value"
                          required
                          label="Code Type"
                          disabled={props.editMode}
                        />
                      </Col>
                      <Col flex={2} xs={12} sm={12}>
                        <Field
                          id="select-return-type"
                          component={SelectField}
                          name="properties.headers.Accept"
                          menuItems={acceptHeaders}
                          itemLabel="displayName"
                          itemValue="value"
                          required
                          label="Accept Header"
                        />
                      </Col>
                      <Col flex={4} xs={12} sm={12}>
                        <Field
                          component={TextField}
                          name="properties.handler"
                          label="Handler"
                          helpText={getRuntime().format}
                          type="text"
                          required
                        />
                      </Col>
                      {values.properties.code_type === 'code' &&
                      <Col flex={2} xs={12} sm={6} md={6}>
                        <MDSelectField
                          id="select-code-theme"
                          label="Editor Theme"
                          menuItems={['monokai', 'chrome']}
                          defaultValue={props.theme}
                          onChange={value => props.handleTheme(value)}
                        />
                      </Col>}

                      {values.properties.code_type === 'code' &&
                      <Col flex={12}>
                        <Field
                          component={AceEditor}
                          mode={getRuntime().codeFormat}
                          theme={props.theme}
                          name="properties.code"
                          maxLines={75}
                          minLines={25}
                        />
                      </Col>}

                      {values.properties.code_type === 'package' &&
                      <Col flex={10} xs={12} sm={12}>
                        <Field
                          component={TextField}
                          name="properties.package_url"
                          label="Package URL"
                          type="text"
                          required
                        />
                      </Col>}
                      {values.properties.code_type === 'package' &&
                      <Col flex={2} xs={12} sm={12}>
                        <Field
                          id="compressed-packageurl"
                          component={Checkbox}
                          name="properties.compressed"
                          label="Compressed Package"
                          // TODO: Find out why redux-form state for bool doesn't apply
                          checked={values.properties.compressed}
                        />
                      </Col>}
                    </Row>
                  </Panel>
                </Col>

                <Col flex={12}>
                  <Panel title="Environment Variables" noPadding>
                    <FieldArray
                      component={UnixVariablesForm}
                      name="properties.env"
                    />
                  </Panel>
                </Col>

                <Col flex={6} xs={12} sm={12}>
                  <Panel title="Advanced">
                    <Row gutter={5}>
                      <Col flex={3} xs={6} sm={6}>
                        <Field
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
                      </Col>
                      <Col flex={3} xs={6} sm={6}>
                        <Field
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
                      </Col>
                      <Col flex={3} xs={6} sm={6}>
                        <Field
                          component={TextField}
                          name="properties.timeout"
                          min={1}
                          step={1}
                          label="Timeout"
                          type="number"
                          required
                          parse={value => Number(value)} // redux form formats everything as string, so force number
                        />
                      </Col>
                      <Col flex={3} xs={6} sm={6}>
                        <Field
                          id="public"
                          component={Checkbox}
                          name="properties.public"
                          // TODO: Find out why redux-form state for bool doesn't apply
                          checked={values.properties.public}
                          label="Public"
                        />
                      </Col>
                    </Row>
                  </Panel>
                </Col>
                <Col flex={6} xs={12} sm={12}>
                  <Panel title="Periodic Configuration">
                    <Row gutter={5}>
                      <Col flex={4} xs={12} sm={12} md={6}>
                        <Field
                          component={TextField}
                          name="properties.periodic_info.schedule"
                          label="Schedule"
                          helpText="Date and time format - ISO 8601"
                          type="text"
                        />
                      </Col>
                      <Col flex={4} xs={12} sm={12} md={6}>
                        <Field
                          id="periodic-timezone"
                          component={SelectField}
                          name="properties.periodic_info.timezone"
                          label="Timezone"
                          menuItems={timezones}
                        />
                      </Col>
                      <Col flex={4} xs={12} sm={12} md={12}>
                        <Field
                          component={TextField}
                          name="properties.periodic_info.payload.eventName"
                          label="Event Name"
                          type="text"
                        />
                      </Col>
                      <Col flex={12} xs={12} sm={12} md={12}>
                        <Field
                          component={TextField}
                          name="properties.periodic_info.payload.data"
                          label="json payload"
                          type="text"
                          rows={2}
                        />
                      </Col>
                    </Row>
                  </Panel>
                </Col>
              </Row>
            </CardText>
          </Col>
        </Row>
      </form>
    </div>
  );
};

LambdaForm.propTypes = {
  values: PropTypes.object.isRequired,
  lambdaPending: PropTypes.bool.isRequired,
  apiEndpointsPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  providersByType: PropTypes.array.isRequired,
  handleTheme: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  executorsDropDown: PropTypes.array.isRequired,
  lambda: PropTypes.object.isRequired,
  apiEndpoints: PropTypes.array.isRequired,
  showEntitlementsModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
  actions: PropTypes.array.isRequired,
  actionsPending: PropTypes.bool.isRequired,
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
