import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, formValueSelector, isInvalid } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import { FullPageFooter } from 'components/FullPage';
import Form from 'components/Form';
import { Panel } from 'components/Panels';
import { Error, P } from 'components/Typography';
import LinkedProviders from '../components/LinkedProviders';
import EnvironmentTypes from '../components/EnvironmentTypes';
import VariablesSection from '../components/VariablesSection';
import DCOSEESection from '../components/DCOSEESection';
import OtherConfigSection from '../components/OtherConfigSection';
import KubeEditorSection from '../components/KubeEditorSection';
import URLConfigSection from '../components/URLConfigSection';
import SecuritySection from '../components/SecuritySection';
import { generateResourceTypeSchema } from '../lists/providerTypes';

const httpProtocols = [{ name: 'HTTPS', value: 'https' }, { name: 'HTTP', value: 'http' }];

const isSubmitDisabled = (props, selectedProviderType) => {
  if (selectedProviderType.allowContainer) {
    return props.envSchemaPending || props.providerPending || props.submitting || props.containerInvalid;
  }

  return props.envSchemaPending || props.providerPending || props.submitting;
};

const ProviderForm = ({ provider, reset, containerFormErrors, editMode, values, fetchEnvSchema, container, onRedeploy, match, showContainer, selectedProviderType, ...props }) => {
  const compiledProviderTypes = generateResourceTypeSchema(props.resourcetypesData);

  // TODO: there is a bug with the first param which should be the value
  const handleProviderChange = (a, value) => {
    const providerType = compiledProviderTypes.find(type => type.name === value);

    if (providerType && providerType.id) {
      fetchEnvSchema(providerType.id);
    }
    reset();
  };

  const handleRedeploy = () => onRedeploy && onRedeploy();
  const submitDisabled = isSubmitDisabled(props, selectedProviderType);
  const linkedProviders = props.providersData.filter(p => p.id !== provider.id);

  return (
    <React.Fragment>
      <Form onSubmit={props.handleSubmit(props.onSubmit)} disabled={props.providerPending} autoComplete="off">
        <Row gutter={5} center>
          <Col flex={12}>
            {editMode && showContainer && props.containerInvalid && <P><Error>Invalid Container Specification</Error></P>}

            {!selectedProviderType.name &&
              <Row gutter={5}>
                {/* only allow the provider type to be selected once - this prevents redux-form errors */}
                <Col flex={12}>
                  <Panel title="Select a Provider Type" expandable={false}>
                    <Field
                      id="select-provider-type"
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
                  </Panel>
                </Col>
              </Row>}

            {selectedProviderType.name &&
              <Row gutter={5}>
                {provider.id &&
                  <Col flex={12}>
                    <Panel title="Resource Details" defaultExpanded={false}>
                      <DetailsPane model={provider} />
                    </Panel>
                  </Col>}
                <Col flex={12}>
                  <Panel title="General" expandable={false}>
                    <Row gutter={5}>
                      {!provider.id &&
                        <Col flex={6} xs={12}>
                          <Field
                            component={TextField}
                            name="name"
                            label="Name"
                            type="text"
                            required
                          />
                        </Col>}
                      <Col flex={12}>
                        <Field
                          id="provider-description"
                          component={TextField}
                          name="description"
                          label="Description"
                          type="text"
                          rows={1}
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
                    <DCOSEESection values={values} />
                  </Col>}

                {/* do not show on edit mode */}
                {selectedProviderType.uploadConfig && !provider.id &&
                  <Col flex={12}>
                    <KubeEditorSection selectedProviderType={selectedProviderType} {...props} />
                  </Col>}


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
                      <OtherConfigSection
                        selectedProviderType={selectedProviderType}
                        showJSON={provider.id}
                        provider={provider}
                      />
                    </Panel>
                  </Col>}
              </Row>}
          </Col>
        </Row>
        <FullPageFooter>
          <Button
            flat
            iconChildren="arrow_back"
            disabled={props.providerPending || props.submitting}
            onClick={props.goBack}
          >
            Providers
          </Button>
          {selectedProviderType.name &&
            <Button
              raised
              iconChildren="save"
              type="submit"
              disabled={submitDisabled}
              primary
            >
              {editMode ? 'Update' : 'Create'}
            </Button>}
          {editMode && showContainer &&
            <Button
              key="provider-container-redeploy"
              raised
              iconChildren="refresh"
              type="submit"
              onClick={handleRedeploy}
              disabled={props.containerInvalid}
              primary
            >
              Redeploy Container
            </Button>}
        </FullPageFooter>
      </Form>
    </React.Fragment>
  );
};

ProviderForm.propTypes = {
  match: PropTypes.object.isRequired,
  providerPending: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  containerFormErrors: PropTypes.object,
  providersData: PropTypes.array.isRequired,
  provider: PropTypes.object,
  envSchemaPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  fetchEnvSchema: PropTypes.func.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  containerInvalid: PropTypes.bool,
  container: PropTypes.object,
  onRedeploy: PropTypes.func,
  resourcetypesData: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
  goBack: PropTypes.func.isRequired,
  showContainer: PropTypes.bool,
  selectedProviderType: PropTypes.object,
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
  containerFormErrors: {},
  showContainer: false,
  selectedProviderType: {},
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
