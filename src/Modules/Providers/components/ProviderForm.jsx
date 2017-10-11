import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, getFormValues, isInvalid } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FileInput from 'react-md/lib/FileInputs';
import AceEditor from 'components/AceEditor';
import JSONTree from 'components/JSONTree';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { Button } from 'components/Buttons';
import PreventAutoFill from 'components/PreventAutoFill';
import Div from 'components/Div';
import DetailsPane from 'components/DetailsPane';
import { VariablesForm } from 'Modules/Variables';
import { ContainerCreate, ContainerInstances, ContainerServiceAddresses, ContainerActions, ContainerActionsModal } from 'Modules/Containers';
import { parseChildClass } from 'util/helpers/strings';
import { isUnixVariable } from 'util/validations';
import LinkedProviders from './LinkedProviders';
import EnvironmentTypes from './EnvironmentTypes';
import { nameMaxLen } from '../validations';
import providerTypes from '../lists/providerTypes';

const httpProtocols = [{ name: 'HTTPS', value: 'https' }, { name: 'HTTP', value: 'http' }];

const ProviderForm = (props) => {
  const { provider, change, reset, values, match, history, container, fetchEnvSchema, fetchProvidersByType } = props;
  const selectedProviderType = providerTypes.find(type => type.value === values.resource_type) || {};
  const getProviders = () => {
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.enviromentId ? 'environments' : 'workspaces';
    fetchProvidersByType(match.params.fqon, entityId, entityKey);
  };

  const goBack = () => {
    if (match.params.workspaceId && !match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}`);
    } else if (match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`);
    } else {
      history.push(`/${match.params.fqon}/hierarchy`);
    }
  };

  const onFile = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      props.dispatch(change('properties.data', reader.result));
    };

    reader.readAsText(file);
  };

  // TODO: there is a bug with the first param which should be the value
  const handleProviderChange = (a, value) => {
    const providerType = providerTypes.find(type => type.value === value);

    // no need to fetch the env schema if a container is not being required
    if (providerType && providerType.allowEnvVariables) {
      fetchEnvSchema(providerType.type);
    }

    reset();
  };

  const renderExternalProtocolSection = () => (
    selectedProviderType.externalProtocol &&
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
  );

  const renderConfigAndSecuritySections = () => (
    <Row>
      {selectedProviderType.config &&
        <Col flex={6} xs={12} sm={12}>
          <Field
            component={TextField}
            name="properties.config.url"
            label="Provider URL/Host:Port"
            type="text"
            required
          />
        </Col>}
      {selectedProviderType.security &&
        <Row gutter={5}>
          <Col flex={2} xs={12} sm={2}>
            <Field
              id="select-return-type"
              component={SelectField}
              name="properties.config.auth.scheme"
              menuItems={['Basic']}
              required
              label="Security Scheme"
            />
          </Col>
          <Col flex={2} xs={12} sm={2}>
            <Field
              component={TextField}
              name="properties.config.auth.username"
              label="Username"
              type="text"
              required
            />
          </Col>
          <Col flex={2} xs={12} sm={2}>
            <PreventAutoFill />
            <Field
              component={TextField}
              name="properties.config.auth.password"
              label="Password"
              type="password"
              required
            />
          </Col>
        </Row>}
    </Row>
  );

  const renderJSONSection = () => (
    !props.envSchemaPending &&
    <Row gutter={5}>
      {selectedProviderType.networking &&
      <Col flex={6} xs={12}>
        <JSONTree
          data={props.provider.properties.config.networks || []}
        />
      </Col>}
      {selectedProviderType.extraConfig &&
      <Col flex={6} xs={12}>
        <JSONTree
          data={props.provider.properties.config.extra || {}}
        />
      </Col>}
    </Row>
  );

  const renderVariablesSection = () => (
    selectedProviderType.allowEnvVariables && selectedProviderType.type &&
    <Row component={Div} disabled={props.envSchemaPending}>
      <PreventAutoFill />
      <Col flex={6} xs={12} sm={12}>
        <VariablesForm
          icon="public"
          addButtonLabel="Add Public Variable"
          fieldName="properties.config.env.public"
          keyFieldValidationFunction={isUnixVariable}
          keyFieldValidationMessage="must be a unix variable name"
        />
      </Col>
      <Col flex={6} xs={12} sm={12}>
        <VariablesForm
          icon="vpn_key"
          addButtonLabel="Add Private Variable"
          fieldName="properties.config.env.private"
          keyFieldValidationFunction={isUnixVariable}
          keyFieldValidationMessage="must be a unix variable name"
        />
      </Col>
    </Row>
  );

  const renderEditorSection = () => (
    // Security: disable editing the yaml in edit mode
    // TODO: This will need to be solved in the future to block sensitive info
    !props.envSchemaPending && !provider.id &&
    <Row>
      {selectedProviderType.uploadConfig &&
        <FileInput
          id="imageInput1"
          label="Upload YAML"
          onChange={onFile}
          accept="application/x-yaml" // The IANA MIME types registry doesn't list YAML yet, so there isn't a correct one, per se.
          primary
        />}
      {selectedProviderType.uploadConfig &&
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              component={AceEditor}
              mode="yaml"
              theme="chrome"
              name="properties.data"
              maxLines={50}
              minLines={15}
              fontSize={12}
            />
          </Col>
        </Row>}
    </Row>
  );

  const renderOtherConfigSection = () => (
    !props.envSchemaPending &&
    <Row gutter={5}>
      {selectedProviderType.networking &&
        <Col flex={6} xs={12}>
          <Field
            component={TextField}
            name="properties.config.networks"
            label="Networks (JSON)"
            type="text"
            rows={2}
          />
        </Col>}
      {selectedProviderType.extraConfig &&
        <Col flex={6} xs={12}>
          <Field
            component={TextField}
            name="properties.config.extra"
            label="Extra Configuration (JSON)"
            type="text"
            rows={2}
          />
        </Col>}
    </Row>
  );

  const renderContainerSection = () => (
    (selectedProviderType.allowContainer && !container.id) &&
    <Row gutter={5}>
      <Col flex={12}>
        <Card title="Container">
          <CardTitle
            title="Container"
            subtitle={`The provider type: ${selectedProviderType.name} requires a container`}
          />
          <ContainerCreate match={props.match} inlineMode />
        </Card>
      </Col>
    </Row>
  );

  const renderContainerInstancesPanel = () => (
    (provider.id && selectedProviderType.allowContainer && container.id) &&
    <Row gutter={5} center>
      <Col
        flex={12}
        xs={12}
        sm={12}
        md={12}
      >
        <Card>
          <ContainerInstances
            containerModel={props.container}
            match={props.match}
            providerType={parseChildClass(provider.resource_type)}
          />
        </Card>
      </Col>

      <Col
        flex={12}
        xs={12}
        sm={12}
        md={12}
      >
        <Card>
          <ContainerServiceAddresses
            containerModel={props.container}
            match={props.match}
          />
        </Card>
      </Col>
    </Row>
  );


  const renderContainerActions = () => (
    (selectedProviderType.allowContainer && container.id) &&
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

  return (
    <Row center>
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
                    {renderContainerActions()}
                  </div>
                }
              />
              <CardText>
                <Row>
                  {/* only allow the provider type to be selected once - this prevents redux-form errors */}
                  {!selectedProviderType.name &&
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
                    </Col>}
                  {selectedProviderType.name &&
                    <Row>
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
                        />
                      </Col>
                    </Row>}
                  {renderConfigAndSecuritySections()}
                  {renderExternalProtocolSection()}
                  {renderEditorSection()}
                  {renderVariablesSection()}
                  {renderOtherConfigSection()}
                  {provider.id && renderJSONSection()}
                </Row>
              </CardText>
              {props.providerUpdatePending || props.envSchemaPending || props.providerPending ? <LinearProgress id="provider-form" /> : null}
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
                    disabled={props.pristine || props.providerUpdatePending || props.envSchemaPending || props.providerPending || props.invalid || props.submitting || props.containerCreateInvalid}
                    primary
                  >
                    {props.submitLabel}
                  </Button>}
              </CardActions>
            </Col>
          </Row>

          {renderContainerInstancesPanel()}

          {selectedProviderType.name &&
            <Row gutter={5} center>
              <Col flex={12} xs={12} sm={12} md={12}>
                <Card>
                  <CardTitle title={<h2>Linked Providers</h2>} />
                  <CardText>
                    <LinkedProviders
                      fetchProviders={getProviders}
                      providersModel={props.providersByType}
                      pending={props.providersByTypePending}
                    />
                  </CardText>
                </Card>
              </Col>

              <Row gutter={5} center>
                <Col flex={12} xs={12} sm={12} md={12}>
                  <Card>
                    <CardTitle
                      title={<h2>Restrict by Environment Type</h2>}
                    />
                    <CardText>
                      <EnvironmentTypes />
                    </CardText>
                  </Card>
                </Col>
              </Row>
            </Row>}
        </form>
        {renderContainerSection()}
      </Col>
    </Row>
  );
};

ProviderForm.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  providerPending: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  providersByType: PropTypes.array.isRequired,
  providersByTypePending: PropTypes.bool.isRequired,
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
  fetchProvidersByType: PropTypes.func.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  containerCreateInvalid: PropTypes.bool.isRequired,
  container: PropTypes.object,
};

ProviderForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  provider: {},
  providerUpdatePending: false,
  container: {},
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state),
    containerCreateInvalid: isInvalid('containerCreate')(state),
  })
)(ProviderForm);
