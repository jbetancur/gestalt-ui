import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, formValueSelector, isInvalid } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { Card, CardTitle, CardText } from 'react-md';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import ActivityContainer from 'components/ActivityContainer';
import Form from 'components/Form';
import Div from 'components/Div';
import { Panel } from 'components/Panels';
import { Caption } from 'components/Typography';
import { ContainerCreate, ContainerEdit, ContainerActions } from 'Modules/Containers';
import LinkedProviders from './LinkedProviders';
import EnvironmentTypes from './EnvironmentTypes';
import VariablesSection from './VariablesSection';
import DCOSEESection from './DCOSEESection';
import OtherConfigSection from './OtherConfigSection';
import KubeEditorSection from './KubeEditorSection';
import URLConfigSection from './URLConfigSection';
import SecuritySection from './SecuritySection';
import { nameMaxLen } from '../validations';
import { generateResourceTypeSchema } from '../lists/providerTypes';

const httpProtocols = [{ name: 'HTTPS', value: 'https' }, { name: 'HTTP', value: 'http' }];

const isSubmitDisabled = (props, selectedProviderType) => {
  if (selectedProviderType.allowContainer) {
    return props.envSchemaPending || props.providerPending || props.submitting || props.containerInvalid;
  }

  return props.envSchemaPending || props.providerPending || props.submitting;
};

const ProviderForm = (props) => {
  const { provider, reset, values, fetchEnvSchema } = props;
  const compiledProviderTypes = generateResourceTypeSchema(props.resourceTypes);
  const selectedProviderType = compiledProviderTypes.find(type => type.name === values.resource_type) || {};
  const showContainer = () => {
    if (props.editMode) {
      return selectedProviderType.allowContainer &&
        provider.properties.services &&
        provider.properties.services.length > 0;
    }

    return selectedProviderType.allowContainer;
  };

  // TODO: there is a bug with the first param which should be the value
  const handleProviderChange = (a, value) => {
    const providerType = compiledProviderTypes.find(type => type.name === value);

    if (providerType && providerType.id) {
      fetchEnvSchema(providerType.id);
    }
    reset();
  };

  const submitDisabled = isSubmitDisabled(props, selectedProviderType);
  const linkedProviders = props.providers.filter(p => p.id !== provider.id);

  return (
    <Row center gutter={5}>
      <Col
        flex={10}
        xs={12}
        sm={12}
        md={12}
      >
        {provider.id &&
        <Col flex={12}>
          <DetailsPane model={provider} />
        </Col>}
        <Card>
          <Form onSubmit={props.handleSubmit(props.onSubmit)} disabled={props.providerPending} autoComplete="off">
            <Row gutter={5} center>
              <Col
                flex={12}
                xs={12}
                sm={12}
                md={12}
              >
                <CardTitle
                  title={
                    <div>
                      {!provider.id && selectedProviderType.name ? `Create Provider: ${selectedProviderType.displayName}` : props.title}
                      {provider.id && `::${selectedProviderType.displayName}`}
                    </div>
                  }
                />
                <ActionsToolbar>
                  <Button
                    flat
                    iconChildren="arrow_back"
                    disabled={props.providerPending || props.submitting}
                    onClick={props.goBack}
                  >
                    {props.cancelLabel}
                  </Button>
                  {selectedProviderType.name &&
                    <Button
                      raised
                      iconChildren="save"
                      type="submit"
                      onClick={() => props.onRedeploy(false)}
                      disabled={submitDisabled}
                      primary
                    >
                      {props.submitLabel}
                    </Button>}
                  {props.editMode && showContainer() &&
                  <Button
                    raised
                    iconChildren="refresh"
                    type="submit"
                    onClick={() => props.onRedeploy(true)}
                    disabled={props.containerInvalid}
                    primary
                  >
                  Redeploy
                  </Button>}
                  {props.editMode && selectedProviderType.allowContainer &&
                    <ContainerActions
                      inContainerView
                      containerModel={props.container}
                      disableDestroy
                      disablePromote
                    />}
                </ActionsToolbar>

                {props.providerPending && <ActivityContainer id="provider-form" />}

                {!selectedProviderType.name &&
                  <CardText>
                    <Row gutter={5}>
                      {/* only allow the provider type to be selected once - this prevents redux-form errors */}
                      <Col flex={12}>
                        <Field
                          id="select-provider"
                          component={SelectField}
                          name="resource_type"
                          menuItems={compiledProviderTypes}
                          itemLabel="displayName"
                          itemValue="name"
                          label="Provider Type"
                          onChange={handleProviderChange}
                          disabled={provider.id}
                          required
                          async
                        />
                      </Col>
                    </Row>
                  </CardText>}

                {!provider.id && selectedProviderType.name &&
                  <Row gutter={5}>
                    <Col flex={12}>
                      <Panel title="General" expandable={false}>
                        <Row gutter={5}>
                          <Col flex={6} xs={12}>
                            <Field
                              component={TextField}
                              name="name"
                              label="Name"
                              type="text"
                              required
                              maxLength={nameMaxLen}
                            />
                          </Col>
                        </Row>
                      </Panel>
                    </Col>
                  </Row>}

                {selectedProviderType.name &&
                  <Row gutter={5}>
                    {selectedProviderType.DCOSConfig &&
                      <Col flex={12}>
                        <Panel title="Configuration" expandable={false}>
                          <URLConfigSection {...props} />

                          {selectedProviderType.DCOSSecurity &&
                            <SecuritySection authScheme={values.properties.config.auth && values.properties.config.auth.scheme} {...props} />}
                        </Panel>
                      </Col>}

                    {selectedProviderType.DCOSEnterprise &&
                      <Col flex={12}>
                        <DCOSEESection {...props} />
                      </Col>}

                    {/* do not show on edit mode */}
                    {selectedProviderType.uploadConfig && !provider.id &&
                      <Col flex={12}>
                        <KubeEditorSection selectedProviderType={selectedProviderType} {...props} />
                      </Col>}

                    <Col flex={12}>
                      <Panel title="Description" defaultExpanded={!!provider.description}>
                        <Field
                          component={TextField}
                          name="description"
                          label="Description"
                          type="text"
                          rows={1}
                          maxRows={4}
                        />
                      </Panel>
                    </Col>

                    {selectedProviderType.allowEnvVariables && <VariablesSection {...props} />}

                    {selectedProviderType.allowLinkedProviders &&
                      <Col flex={12}>
                        <LinkedProviders providersModel={linkedProviders} />
                      </Col>}
                    {selectedProviderType.allowedRestrictEnvironments &&
                      <Col flex={12}>
                        <EnvironmentTypes />
                      </Col>}

                    {selectedProviderType.allowAdvanced &&
                      <Col flex={12}>
                        <Panel title="Advanced" defaultExpanded={false}>
                          {selectedProviderType.externalProtocol &&
                            <Row gutter={5}>
                              <Col flex={2} xs={12} sm={4}>
                                <Field
                                  id="select-external-protocol"
                                  component={SelectField}
                                  name="properties.config.external_protocol"
                                  menuItems={httpProtocols}
                                  itemLabel="name"
                                  itemValue="value"
                                  label="External Protocol"
                                  helpText="The protocol used to reach any externally exposed endpoints"
                                />
                              </Col>
                            </Row>}
                          <OtherConfigSection selectedProviderType={selectedProviderType} showJSON={provider.id} {...props} />
                        </Panel>
                      </Col>}
                  </Row>}
              </Col>
            </Row>
          </Form>
          {showContainer() &&
            <Row gutter={5} component={Div} pending={props.providerPending}>
              <Col flex={12}>
                <Panel title="Container Specification" defaultExpanded={showContainer()}>
                  <Caption light>{`The provider type ${selectedProviderType.displayName} requires a container`}</Caption>
                  {props.editMode ?
                    <ContainerEdit containerSpec={provider.properties.services[0].container_spec} inlineMode /> : <ContainerCreate inlineMode />}
                </Panel>
              </Col>
            </Row>}
        </Card>
      </Col>
    </Row>
  );
};

ProviderForm.propTypes = {
  providerPending: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  providers: PropTypes.array.isRequired,
  provider: PropTypes.object,
  envSchemaPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  fetchEnvSchema: PropTypes.func.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  containerInvalid: PropTypes.bool,
  container: PropTypes.object,
  onRedeploy: PropTypes.func,
  resourceTypes: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
  goBack: PropTypes.func.isRequired,
};

ProviderForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  provider: {},
  container: {},
  onRedeploy: null,
  editMode: false,
  containerInvalid: false,
};

// Connect to this forms state in the store so we can enum the values
const selector = form => formValueSelector(form);
export default connect(
  (state, props) => ({
    values: selector(props.form)(state,
      'resource_type',
      'properties.config.auth',
      'properties.config.secret_support',
      'properties.config.accept_any_cert',
    ),
    containerInvalid: isInvalid(props.editMode ? 'containerEdit' : 'containerCreate')(state),
  })
)(ProviderForm);
