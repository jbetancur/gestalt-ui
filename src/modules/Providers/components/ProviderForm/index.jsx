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
import { ExpansionList } from 'react-md/lib/ExpansionPanels';
import { ExpansionPanel } from 'components/ExpansionList';
import AceEditor from 'components/AceEditor';
import JSONTree from 'components/JSONTree';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { Button } from 'components/Buttons';
import PreventAutoFill from 'components/PreventAutoFill';
import Div from 'components/Div';
import { VariablesForm } from 'modules/Variables';
import { ContainerCreate, ContainerInstances, ContainerServiceAddresses, ContainerActions } from 'modules/Containers';
import { parseChildClass } from 'util/helpers/strings';
import { isUnixVariable } from 'util/validations';
import LinkedProviders from '../LinkedProviders';
import { nameMaxLen } from './validations';
import providerTypes from '../../lists/providerTypes';

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
    <Field
      id="select-return-type"
      className="flex-2 flex-xs-12 flex-sm-4"
      component={SelectField}
      name="properties.config.external_protocol"
      menuItems={httpProtocols}
      itemLabel="name"
      itemValue="value"
      label="External Protocol"
      helpText="The protocol used to reach any externally exposed endpoints"
    />
  );

  const renderConfigAndSecuritySections = () => (
    <div className="flex-row no-gutter">
      {selectedProviderType.config &&
        <Field
          className="flex-6 flex-xs-12 flex-sm-12"
          component={TextField}
          name="properties.config.url"
          label="Provider URL/Host:Port"
          type="text"
          required
        />}
      {selectedProviderType.security &&
        <div className="flex-6 flex-xs-12 flex-sm-12 flex-row">
          <Field
            id="select-return-type"
            className="flex-4 flex-xs-12 flex-sm-4"
            component={SelectField}
            name="properties.config.auth.scheme"
            menuItems={['Basic']}
            required
            label="Security Scheme"
          />
          <Field
            className="flex-4 flex-xs-12 flex-sm-4"
            component={TextField}
            name="properties.config.auth.username"
            label="Username"
            type="text"
            required
          />
          <PreventAutoFill />
          <Field
            className="flex-4 flex-xs-12 flex-sm-4"
            component={TextField}
            name="properties.config.auth.password"
            label="Password"
            type="password"
            required
          />
        </div>}
    </div>
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
        <div className="flex-row">
          <Field
            className="flex-12"
            component={AceEditor}
            mode="yaml"
            theme="chrome"
            name="properties.data"
            maxLines={50}
            minLines={15}
            fontSize={12}
          />
        </div>}
    </Row>
  );

  const renderOtherConfigSection = () => (
    !props.envSchemaPending &&
    <div className="flex-row">
      {selectedProviderType.networking &&
        <Field
          className="flex-6 flex-xs-12"
          component={TextField}
          name="properties.config.networks"
          label="Networks (JSON)"
          type="text"
          rows={2}
        />}
      {selectedProviderType.extraConfig &&
        <Field
          className="flex-6 flex-xs-12"
          component={TextField}
          name="properties.config.extra"
          label="Extra Configuration (JSON)"
          type="text"
          rows={2}
        />}
    </div>
  );

  const renderContainerSection = () => (
    (selectedProviderType.allowContainer && !container.id) &&
    <Col flex={10} xs={12} sm={12} md={12}>
      <Card title="Container">
        <CardTitle
          title="Container"
          subtitle={`The provider type: ${selectedProviderType.name} requires a container`}
        />
        <ContainerCreate match={props.match} inlineMode />
      </Card>
    </Col>
  );

  const renderContainerInstancesPanel = () => (
    (provider.id && selectedProviderType.allowContainer && container.id) &&
    <Row gutter={5} center>
      <Col
        flex={10}
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
        flex={10}
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
      <ContainerActions
        containerModel={container}
        inContainerView
        disableDestroy
        disablePromote
        {...props}
      />
  );

  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
      <Row gutter={5} center>
        <Col
          component={Card}
          flex={10}
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
            subtitle={provider.id}
          />
          <CardText>
            <Row>
              <div className="flex-row">
                {/* only allow the provider type to be selected once - this prevents redux-form errors */}
                {!selectedProviderType.name &&
                  <Field
                    id="select-provider"
                    className="flex-12"
                    component={SelectField}
                    name="resource_type"
                    menuItems={providerTypes}
                    itemLabel="name"
                    itemValue="value"
                    required
                    label="Provider Type"
                    disabled={provider.id}
                    onChange={handleProviderChange}
                  />}
                {selectedProviderType.name &&
                  <Row>
                    <Field
                      className="flex-6 flex-xs-12"
                      component={TextField}
                      name="name"
                      label="Name"
                      type="text"
                      required
                      maxLength={nameMaxLen}
                      disabled={provider.id}
                    />
                    <Field
                      className="flex-6 flex-xs-12"
                      component={TextField}
                      name="description"
                      label="Description"
                      type="text"
                    />
                  </Row>}
              </div>
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
          <Col flex={10} xs={12} sm={12} md={12}>
            <ExpansionList>
              <ExpansionPanel label={<h2>Linked Providers</h2>} defaultExpanded footer={null}>
                <LinkedProviders fetchProviders={getProviders} providersModel={props.providersByType} pending={props.providersByTypePending} />
              </ExpansionPanel>
            </ExpansionList>
          </Col>

          {renderContainerSection()}
        </Row>}
    </form>
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
