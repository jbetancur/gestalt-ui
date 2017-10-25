import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, getFormValues, isInvalid } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { Card, CardTitle, CardActions, CardText, LinearProgress } from 'react-md';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import { ContainerActions, ContainerActionsModal } from 'Modules/Containers';
import LinkedProviders from './LinkedProviders';
import EnvironmentTypes from './EnvironmentTypes';
import VariablesSection from './VariablesSection';
import DCOSEESection from './DCOSEESection';
import OtherConfigSection from './OtherConfigSection';
import KubeEditorSection from './KubeEditorSection';
import URLConfigSection from './URLConfigSection';
import SecuritySection from './SecuritySection';
import ContainerSection from './ContainerSection';
import ContainerInstanceSection from './ContainerInstanceSection';
import { nameMaxLen } from '../validations';
import providerTypes from '../lists/providerTypes';

const httpProtocols = [{ name: 'HTTPS', value: 'https' }, { name: 'HTTP', value: 'http' }];

const ProviderForm = (props) => {
  const { provider, reset, values, history, container, fetchEnvSchema } = props;
  const selectedProviderType = providerTypes.find(type => type.value === values.resource_type) || {};

  const goBack = () => {
    history.goBack();
  };

  // TODO: there is a bug with the first param which should be the value
  const handleProviderChange = (a, value) => {
    const providerType = providerTypes.find(type => type.value === value);

    // no need to fetch env schema if we do not allowEnvVariables
    if (providerType && providerType.allowEnvVariables) {
      fetchEnvSchema(providerType.type);
    }

    reset();
  };

  const renderContainerActions = () => (
    <div>
      <ContainerActionsModal />
      <ContainerActions
        containerModel={container}
        inContainerView
        disableDestroy
        disablePromote
        {...props}
      />
    </div>
  );

  const submitDisabled = props.pristine || props.providerUpdatePending || props.envSchemaPending || props.providerPending || props.invalid || props.submitting || props.containerCreateInvalid;
  const linkedProviders = props.providersByType.filter(p => p.id !== provider.id);

  return (
    <Row center onRedeploy={props.onRedeploy}>
      <Col
        flex={10}
        xs={12}
        sm={12}
        md={12}
      >
        <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
          {provider.id &&
            <Row gutter={5} center>
              <Col flex={12}>
                <DetailsPane model={provider} />
              </Col>
            </Row>}
          <Row gutter={5} center>
            <Col
              component={Card}
              flex={12}
              xs={12}
              sm={12}
              md={12}
            >
              <CardTitle
                title={
                  <div>
                    {!provider.id && selectedProviderType.name ? `Create Provider: ${selectedProviderType.name}` : props.title}
                    {provider.id && `::${selectedProviderType.name}`}
                    {(selectedProviderType.allowContainer && container.id) && renderContainerActions()}
                  </div>
                }
              />
              <CardText>
                {!selectedProviderType.name ?
                  <Row gutter={5}>
                    {/* only allow the provider type to be selected once - this prevents redux-form errors */}
                    <Col flex={6}>
                      <Field
                        id="select-provider"
                        component={SelectField}
                        name="resource_type"
                        menuItems={providerTypes}
                        itemLabel="name"
                        itemValue="value"
                        required
                        label="Provider Type"
                        disabled={provider.id}
                        onChange={handleProviderChange}
                      />
                    </Col>
                  </Row>
                  :
                  <div>
                    <Row gutter={5}>
                      <Col flex={6} xs={12}>
                        <Field
                          component={TextField}
                          name="name"
                          label="Name"
                          type="text"
                          required
                          maxLength={nameMaxLen}
                          disabled={provider.id}
                        />
                      </Col>
                      <Col flex={6} xs={12}>
                        <Field
                          component={TextField}
                          name="description"
                          label="Description"
                          type="text"
                          rows={1}
                          maxRows={4}
                        />
                      </Col>
                    </Row>
                    {selectedProviderType.DCOSConfig &&
                      <URLConfigSection {...props} />}

                    {selectedProviderType.DCOSSecurity &&
                      <SecuritySection authScheme={values.properties.config.auth && values.properties.config.auth.scheme} {...props} />}

                    {selectedProviderType.DCOSEnterprise &&
                      <DCOSEESection {...props} />}

                    {selectedProviderType.externalProtocol &&
                      <Row gutter={5}>
                        <Col flex={2} xs={12} sm={4}>
                          <Field
                            id="select-return-type"
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

                    {selectedProviderType.uploadConfig && !provider.id &&
                      <KubeEditorSection selectedProviderType={selectedProviderType} {...props} />}

                    <OtherConfigSection selectedProviderType={selectedProviderType} showJSON={provider.id} {...props} />

                    {selectedProviderType.allowEnvVariables &&
                      <VariablesSection {...props} />}
                  </div>}
              </CardText>
              {(props.providerUpdatePending || props.providerPending) && <LinearProgress id="provider-form" />}
              <CardActions>
                <Button
                  flat
                  disabled={props.providerUpdatePending || props.providerPending || props.submitting}
                  onClick={goBack}
                >
                  {props.cancelLabel}
                </Button>
                {selectedProviderType.name &&
                  <Button
                    raised
                    type="submit"
                    onClick={() => props.onRedeploy(false)}
                    disabled={submitDisabled}
                    primary
                  >
                    {props.submitLabel}
                  </Button>}
                {provider.id && selectedProviderType.allowContainer &&
                <Button
                  raised
                  type="submit"
                  onClick={() => props.onRedeploy(true)}
                  disabled={submitDisabled}
                  primary
                >
                Update & Redeploy
                </Button>}
              </CardActions>
            </Col>
          </Row>

          {(provider.id && selectedProviderType.allowContainer && container.id) &&
            <ContainerInstanceSection container={props.container} provider={props.provider} {...props} />}

          {selectedProviderType.name &&
            <Row gutter={5} center>
              <Col flex={12} xs={12} sm={12} md={12}>
                <Card>
                  <CardTitle title="Linked Providers" />
                  <CardText>
                    <LinkedProviders
                      providersModel={linkedProviders}
                    />
                  </CardText>
                </Card>
              </Col>

              <Row gutter={5} center>
                <Col flex={12} xs={12} sm={12} md={12}>
                  <Card>
                    <CardTitle
                      title="Allowed Environments"
                    />
                    <CardText>
                      <EnvironmentTypes />
                    </CardText>
                  </Card>
                </Col>
              </Row>
            </Row>}
        </form>
        {(selectedProviderType.allowContainer && !container.id) &&
          <ContainerSection name={selectedProviderType.name} {...props} />}
      </Col>
    </Row>
  );
};

ProviderForm.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  providerPending: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  providersByType: PropTypes.array.isRequired,
  provider: PropTypes.object,
  providerUpdatePending: PropTypes.bool,
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
  containerCreateInvalid: PropTypes.bool.isRequired,
  container: PropTypes.object,
  onRedeploy: PropTypes.func,
};

ProviderForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  provider: {},
  providerUpdatePending: false,
  container: {},
  onRedeploy: null,
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state),
    containerCreateInvalid: isInvalid('containerCreate')(state),
  })
)(ProviderForm);
