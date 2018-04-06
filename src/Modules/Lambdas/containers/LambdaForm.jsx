import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Field, FieldArray, formValueSelector } from 'redux-form';
import { Link } from 'react-router-dom';
import { SelectField as MDSelectField } from 'react-md';
import Form from 'components/Form';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Checkbox, SelectField, TextField, AceEditor } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Subtitle } from 'components/Typography';
import { UnixVariablesForm } from 'Modules/Variables';
import { ActionsMenu } from 'Modules/Actions';
import { APIEndpointInlineList } from 'Modules/APIEndpoints';
import ActionsToolbar from 'components/ActionsToolbar';
import { FullPageFooter } from 'components/FullPage';
import runTimes from '../lists/runTimes';
import acceptHeaders from '../lists/acceptHeaders';

const timezones = moment.tz.names();

const LambdaForm = (props) => {
  const { values, match, lambda, editMode } = props;

  // TODO: Since we dont have ui specific props from the ui just use a lookup list for now
  const getRuntime = () => runTimes.find((runtime) => {
    if (values.properties.runtime) {
      const rindex = values.properties.runtime.indexOf('---');

      if (rindex > -1) {
        return runtime.value === values.properties.runtime.substring(0, rindex);
      }

      return runtime.value;
    }

    return {};
  }) || '';

  // if doesn't support inline set back to package
  const handleSupportsInline = () => {
    const items = getRuntime().codeOptions;
    if (items && items.some(opt => opt.value !== 'code')) {
      props.change('properties.code_type', 'package');
    }
  };

  // Since runtime values can be a dupes - we need to make each item unique. We will strip this off in the payload transforner
  const uniqueExecutors = props.executorsDropDown.map((exec, i) => ({ ...exec, runtime: `${exec.runtime}---${i}` }));
  const lambdaPaneTitle = props.editMode ? `Function: ${values.properties.runtime}` : 'Function';

  return (
    <Form
      onSubmit={props.handleSubmit(props.onSubmit)}
      autoComplete="off"
      disabled={props.lambdaPending}
    >
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={props.title}
            showActions={editMode}
            actions={[
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
                onClick={() => props.entitlementActions.showEntitlementsModal(props.title, props.match.params.fqon, lambda.id, 'lambdas', 'Lambda')}
              >
                Entitlements
              </Button>
            ]}
          />

          {props.lambdaPending && <ActivityContainer id="lambda-form" />}

          <Row gutter={5}>
            {editMode &&
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
                  <DetailsPane model={lambda} />
                </Panel>
              </Col>}
            <Col flex={12}>
              <Panel title="General" expandable={false} >
                <Row gutter={5}>
                  {editMode &&
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
                        disabled={editMode}
                        async
                      />
                    </Col>}
                  <Col flex={6} xs={12} sm={12}>
                    <Field
                      component={TextField}
                      name="name"
                      label="Lambda Name"
                      type="text"
                      required
                    />
                  </Col>

                  <Col flex={12}>
                    <Field
                      id="description"
                      component={TextField}
                      name="description"
                      label="Description"
                      rows={1}
                    />
                  </Col>
                </Row>
              </Panel>
            </Col>

            {props.editMode &&
            <Col flex={12}>
              <Panel title="Public Endpoints" pending={props.apiEndpointsPending} noPadding count={props.apiEndpoints.length}>
                <APIEndpointInlineList
                  endpoints={props.apiEndpoints}
                  onAddEndpoint={() => props.showAPIEndpointWizardModal(match.params, lambda.id, 'lambda')}
                />
              </Panel>
            </Col>}

            <Col flex={12}>
              <Panel title={lambdaPaneTitle}>
                <Row gutter={5}>
                  {!props.editMode &&
                  <Col flex={3} xs={12} sm={12}>
                    <Field
                      id="select-runtime"
                      component={SelectField}
                      name="properties.runtime"
                      menuItems={uniqueExecutors}
                      itemLabel="name"
                      itemValue="runtime"
                      required
                      label="Runtime"
                      async
                      onChange={handleSupportsInline}
                      disabled={props.editMode}
                    />
                  </Col>}
                  {!props.editMode &&
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
                    </Col>}

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
                  <Col flex>
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
                    <Row>
                      <Col flex={2} xs={12} sm={6} md={6}>
                        <MDSelectField
                          id="select-code-theme"
                          label="Editor Theme"
                          menuItems={['monokai', 'chrome']}
                          defaultValue={props.theme}
                          onChange={props.handleTheme}
                        />
                      </Col>
                      <Col flex={12}>
                        <Field
                          component={AceEditor}
                          mode={getRuntime().codeFormat}
                          theme={props.theme}
                          name="properties.code"
                          maxLines={75}
                          minLines={25}
                        />
                      </Col>
                    </Row>}

                  {values.properties.code_type === 'package' &&
                  <Col flex={10} xs={12} sm={12}>
                    <Field
                      component={TextField}
                      name="properties.package_url"
                      label="Package URL"
                      type="text"
                      helpText="The url to the package directory or file (if it is zipped)"
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
              <Panel title="Environment Variables" noPadding count={values.properties.env.length}>
                <FieldArray
                  component={UnixVariablesForm}
                  name="properties.env"
                />
              </Panel>
            </Col>

            <Col flex={12}>
              <Panel title="Periodic Configuration">
                <Row gutter={5}>
                  <Col flex={6} xs={12} sm={12} md={6}>
                    <Field
                      component={TextField}
                      name="properties.periodic_info.schedule"
                      label="Schedule"
                      helpText="Date and time format - ISO 8601"
                      type="text"
                    />
                  </Col>
                  <Col flex={3} xs={12} sm={12} md={6}>
                    <Field
                      id="periodic-timezone"
                      component={SelectField}
                      name="properties.periodic_info.timezone"
                      label="Timezone"
                      menuItems={timezones}
                    />
                  </Col>
                  <Col flex={3} xs={12} sm={12} md={12}>
                    <Field
                      component={TextField}
                      name="properties.periodic_info.payload.eventName"
                      label="Event Name"
                      type="text"
                    />
                  </Col>
                  <Col flex={12} xs={12} sm={12} md={12}>
                    <Subtitle>JSON Payload</Subtitle>
                    <Field
                      component={AceEditor}
                      mode="json"
                      theme="chrome"
                      name="properties.periodic_info.payload.data"
                      minLines={5}
                      maxLines={20}
                    />
                  </Col>
                </Row>
              </Panel>
            </Col>

            <Col flex={12}>
              <Panel title="Advanced" defaultExpanded={false}>
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
                      parse={value => parseFloat(value)} // redux form formats everything as string, so force number
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
          </Row>
        </Col>
      </Row>

      <FullPageFooter>
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
          disabled={props.pristine || props.lambdaPending || props.submitting}
          primary
        >
          {props.submitLabel}
        </Button>
      </FullPageFooter>
    </Form>
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
  submitting: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  providersByType: PropTypes.array.isRequired,
  handleTheme: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  executorsDropDown: PropTypes.array.isRequired,
  lambda: PropTypes.object.isRequired,
  apiEndpoints: PropTypes.array.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
  actions: PropTypes.array.isRequired,
  actionsPending: PropTypes.bool.isRequired,
  showAPIEndpointWizardModal: PropTypes.func.isRequired,
  entitlementActions: PropTypes.object,
};

LambdaForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
  entitlementActions: {}
};

// Connect to this forms state in the store so we can enum the values
const selector = form => formValueSelector(form);
export default connect(
  (state, props) => ({
    values: selector(props.form)(state,
      'properties.public',
      'properties.runtime',
      'properties.code_type',
      'properties.compressed',
      'properties.env',
    ),
  })
)(LambdaForm);
