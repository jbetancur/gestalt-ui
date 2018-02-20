import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, FieldArray, formValueSelector } from 'redux-form';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import { Card, CardTitle, CardText, FontIcon } from 'react-md';
import { metaModels } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import Form from 'components/Form';
import { Checkbox, SelectField, TextField, AceEditor } from 'components/ReduxFormFields';
import { UnixVariablesForm, LabelsForm } from 'Modules/Variables';
import { SecretsPanelForm } from 'Modules/Secrets';
import { APIEndpointInlineList } from 'Modules/APIEndpoints';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { Panel } from 'components/Panels';
import { Title, Caption, Error } from 'components/Typography';
import Div from 'components/Div';
import { getLastFromSplit } from 'util/helpers/strings';
import ContainerInstances from './ContainerInstances';
import ContainerServiceAddresses from './ContainerServiceAddresses';
import { nameMaxLen, descriptionMaxLen } from '../validations';
import ContainerActions from './ContainerActions';
import ContainerIcon from './ContainerIcon';
import ActionsModals from '../ActionModals';
import PortMappingsForm from './PortMappingsForm';
import VolumesForm from './VolumesForm';
import HealthChecksForm from './HealthChecksForm';

const fixInputNumber = value => value && parseInt(value, 10);

const ContainerForm = ({ match, values, container, containerPending, editMode, inlineMode, ...props }) => {
  const selectedProvider = metaModels.provider.get(props.providersByType
    .find(provider => values.properties.provider.id === provider.id));

  // TODO: Remove when Kubernetes/Docker when api is ready
  const providerType = getLastFromSplit(selectedProvider.resource_type);
  const isSubmitDisabled =
    editMode ? (containerPending || props.submitting)
      : (props.pristine || containerPending || props.submitting);

  const hasInstances = props.containerInstances.length > 0;
  const hasServiceAddresses = container.properties.port_mappings.length > 0 && container.properties.port_mappings.some(p => p.service_address);
  const isPending = !inlineMode && containerPending;
  const enabledEndpoints = editMode && !inlineMode && container.properties.port_mappings.length > 0;
  const isSecretsEnabled = () => {
    if (providerType === 'Kubernetes') {
      return true;
    }

    if (providerType === 'Docker') {
      return false;
    }

    if (providerType === 'DCOS' && selectedProvider.properties.config.secret_support) {
      return true;
    }

    return false;
  };

  const isHealthChecksEnabled = providerType !== 'Docker';
  // TODO: Fix "dummy" param - react-md passes busted data in first parram probably conflicting with onChange event of Refux Form Field
  const getSecrets = (dummy, id) => {
    props.fetchSecretsDropDown(match.params.fqon, match.params.environmentId, id);
  };
  const setNetworks = () => (providerType === 'Kubernetes' ? [{ name: 'default' }] : selectedProvider.properties.config.networks);

  return (
    <div>
      <ActionsModals />
      <Form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off" disabled={isPending}>
        <Row gutter={5} center>
          {editMode &&
            <Col flex={inlineMode ? 12 : 10}>
              <DetailsPane model={container} />
            </Col>}
          <Col
            flex={inlineMode ? 12 : 10}
            xs={12}
            sm={12}
            md={12}
          >
            <Card className={inlineMode ? 'md-no-paper' : ''}>
              <CardTitle
                title={
                  <div>
                    <div>{props.title}</div>
                    {selectedProvider.id &&
                      <Title>
                        <ContainerIcon resourceType={providerType} /> {selectedProvider.name}
                      </Title>}
                  </div>
                }
              />
              {!inlineMode &&
                <ActionsToolbar>
                  <Row>
                    <Col flex={12}>
                      <Button
                        flat
                        iconChildren="arrow_back"
                        disabled={containerPending || props.submitting}
                        component={Link}
                        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`}
                      >
                        {props.cancelLabel}
                      </Button>

                      {selectedProvider.id &&
                        <Button
                          raised
                          iconChildren="save"
                          type="submit"
                          disabled={isSubmitDisabled}
                          primary
                        >
                          {props.submitLabel}
                        </Button>}
                      {editMode &&
                        <Button
                          key="container--entitlements"
                          flat
                          iconChildren="security"
                          onClick={() => props.entitlementActions.showEntitlementsModal(props.title, match.params.fqon, container.id, 'containers', 'Container')}
                        >
                          Container Entitlements
                        </Button>}
                      {editMode &&
                        <ContainerActions
                          inContainerView
                          containerModel={container}
                          disableDestroy={inlineMode}
                          disablePromote={inlineMode}
                        />}
                    </Col>
                  </Row>
                </ActionsToolbar>}

              {isPending && <ActivityContainer id="container-form-loading" />}

              <CardText>
                {!values.properties.provider.id &&
                  <Row gutter={5}>
                    <Col flex={12}>
                      <Field
                        id="select-provider"
                        component={SelectField}
                        name="properties.provider.id"
                        required
                        label="Provider"
                        itemLabel="name"
                        itemValue="id"
                        menuItems={props.providersByType}
                        onChange={getSecrets}
                        async
                      />
                    </Col>
                  </Row>}

                {values.properties.provider.id &&
                  <Row gutter={5}>

                    {selectedProvider.id && hasInstances &&
                      <Col flex={12}>
                        <Panel
                          title="Running Instances"
                          noPadding
                          count={container.properties.instances && container.properties.instances.length}
                          icon={<FontIcon>memory</FontIcon>}
                        >
                          <ContainerInstances
                            instances={props.containerInstances}
                            providerType={providerType}
                            containerModel={container}
                          />
                        </Panel>
                      </Col>}

                    {selectedProvider.id && hasServiceAddresses &&
                      <Col flex={12}>
                        <Panel
                          title="Service Addresses"
                          noPadding
                          count={container.properties.port_mappings && container.properties.port_mappings.length}
                          icon={<FontIcon>settings_ethernet</FontIcon>}
                        >
                          <ContainerServiceAddresses
                            portMappings={container.properties.port_mappings}
                          />
                        </Panel>
                      </Col>}

                    {/* disabled for provider containers "inline mode" */}
                    {editMode && !inlineMode &&
                    <Col flex={12}>
                      <Panel
                        title="Public Endpoints"
                        pending={props.apiEndpointsPending}
                        noPadding
                        count={props.apiEndpoints.length}
                      >

                        {!enabledEndpoints &&
                          <Div padding="16px">
                            {!enabledEndpoints && values.properties.port_mappings.length > 0 ?
                              <Error block>* Save your changes to add an endpoint</Error> : <Caption>Add a Service Mapping to add a Public Endpoint</Caption>}
                          </Div>}

                        <APIEndpointInlineList
                          endpoints={props.apiEndpoints}
                          onAddEndpoint={() => props.showAPIEndpointWizardModal(match.params, container.id, 'container', values.properties.port_mappings)}
                          disabled={!enabledEndpoints}
                        />
                      </Panel>
                    </Col>}

                    <Col flex={12}>
                      <Panel title="General" expandable={false}>
                        <Row gutter={5}>
                          <Col flex={6} xs={12}>
                            <Field
                              id="container-name"
                              component={TextField}
                              name="name"
                              label="Name"
                              type="text"
                              required
                              maxLength={nameMaxLen}
                              disabled={editMode}
                              helpText="the name of the container"
                            />
                          </Col>

                          <Col flex={2} xs={12}>
                            <Field
                              component={TextField}
                              name="properties.num_instances"
                              min={0}
                              max={999}
                              step={1}
                              label="Instances"
                              type="number"
                              normalize={fixInputNumber}
                              helpText="0 = suspended"
                            />
                          </Col>
                          <Col flex={2} xs={12}>
                            <Field
                              component={TextField}
                              name="properties.cpus"
                              min={0.1}
                              max={10.0}
                              step="any"
                              label="CPU"
                              type="number"
                              required
                              parse={value => Number(value)} // redux form formats everything as string, so force number
                            />
                          </Col>
                          <Col flex={2} xs={12}>
                            <Field
                              component={TextField}
                              name="properties.memory"
                              min={32}
                              step={1}
                              label="Memory"
                              type="number"
                              required
                              normalize={fixInputNumber}
                            />
                          </Col>

                          <Col flex={10} xs={12}>
                            <Field
                              component={TextField}
                              name="properties.image"
                              label="Image"
                              type="text"
                              required
                              helpText="e.g. nginx:alpine"
                            />
                          </Col>

                          <Col flex={2} xs={12}>
                            <Field
                              id="force_pull"
                              component={Checkbox}
                              name="properties.force_pull"
                              // TODO: Find out why redux-form state for bool doesn't apply
                              checked={values.properties.force_pull}
                              label="Force Pull"
                            />
                          </Col>
                        </Row>
                      </Panel>
                    </Col>

                    <Col flex={12}>
                      <Panel
                        title="Networking"
                        expandable={false}
                      >
                        <Row gutter={5}>
                          <Col flex={6} xs={12}>
                            <Field
                              id="select-network"
                              component={SelectField}
                              name="properties.network"
                              menuItems={setNetworks()}
                              disabled={!setNetworks().length}
                              label={!setNetworks().length ? 'No Configured Network Types' : 'Network Type'}
                              itemLabel="name"
                              itemValue="name"
                              required
                            />
                          </Col>
                        </Row>
                        {values.properties.network &&
                        <Panel title="Service Mappings" noPadding count={values.properties.port_mappings.length}>
                          <FieldArray
                            name="properties.port_mappings"
                            component={PortMappingsForm}
                            networkType={values.properties.network}
                            portMappingFormValues={values.properties.port_mappings}
                          />
                        </Panel>}
                      </Panel>
                    </Col>

                    <Col flex={12}>
                      <Panel title="Description" defaultExpanded={!!container.description}>
                        <Field
                          id="container-description"
                          component={TextField}
                          name="description"
                          placeholder="Description"
                          type="text"
                          maxLength={descriptionMaxLen}
                          rows={1}
                        />
                      </Panel>
                    </Col>

                    <Col flex={12}>
                      <Panel title="Command" noPadding defaultExpanded={!!container.properties.cmd}>
                        <Field
                          component={AceEditor}
                          mode="sh"
                          theme="chrome"
                          name="properties.cmd"
                          maxLines={10}
                          minLines={5}
                        />
                      </Panel>
                    </Col>

                    <Col flex={12}>
                      <Panel
                        title="Environment Variables"
                        defaultExpanded={values.properties.env.length > 0}
                        noPadding
                        count={values.properties.env.length}
                      >
                        <FieldArray
                          component={UnixVariablesForm}
                          name="properties.env"
                        />
                      </Panel>
                    </Col>

                    <Col flex={12}>
                      <Panel
                        title="Labels"
                        defaultExpanded={values.properties.labels.length > 0}
                        noPadding
                        count={values.properties.labels.length}
                      >
                        <FieldArray
                          component={LabelsForm}
                          name="properties.labels"
                        />
                      </Panel>
                    </Col>

                    <Col flex={12}>
                      <Panel
                        title="Volumes"
                        noPadding
                        defaultExpanded={values.properties.volumes.length > 0}
                        count={values.properties.volumes.length}
                      >
                        <FieldArray
                          name="properties.volumes"
                          component={VolumesForm}
                          providerType={providerType}
                          volumeFormValues={values.properties.volumes}
                        />
                      </Panel>
                    </Col>

                    {isSecretsEnabled() &&
                    <Col flex={12}>
                      <Panel
                        title="Secrets"
                        noPadding
                        defaultExpanded={values.properties.secrets.length > 0}
                        count={values.properties.secrets.length}
                      >
                        <FieldArray
                          name="properties.secrets"
                          component={SecretsPanelForm}
                          secrets={props.secretsDropDown}
                          providerType={providerType}
                          secretFormValues={values.properties.secrets}
                        />
                      </Panel>
                    </Col>}

                    {/* TODO: Implement for Kubernetes/Docker when api is ready */}
                    {isHealthChecksEnabled &&
                    <Col flex={12}>
                      <Panel
                        title="Health Checks"
                        noPadding
                        defaultExpanded={values.properties.health_checks.length > 0}
                        count={values.properties.health_checks.length}
                      >
                        <FieldArray
                          name="properties.health_checks"
                          component={HealthChecksForm}
                          healthCheckvalues={values.properties.health_checks}
                        />
                      </Panel>
                    </Col>}

                    <Col flex={12}>
                      <Panel title="Advanced" defaultExpanded={false}>
                        <Field
                          component={TextField}
                          name="properties.constraints"
                          label="Constraints"
                          type="text"
                          helpText="Comma delimited set of constraints e.g. <field name>:<LIKE | UNLIKE | UNIQUE | CLUSTER | GROUP_BY | MAX_PER>:<optional param>, ..."
                        />
                        <Field
                          component={TextField}
                          name="properties.accepted_resource_roles"
                          label="Resource Roles"
                          type="text"
                          helpText="Comma delimited set of resource roles"
                        />
                        <Field
                          component={TextField}
                          name="properties.user"
                          label="User"
                          type="text"
                          helpText="unix formatted username"
                        />
                      </Panel>
                    </Col>
                  </Row>}
              </CardText>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

ContainerForm.propTypes = {
  fetchProvidersByType: PropTypes.func.isRequired,
  fetchSecretsDropDown: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  containerPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  providersByType: PropTypes.array.isRequired,
  container: PropTypes.object.isRequired,
  entitlementActions: PropTypes.object,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
  inlineMode: PropTypes.bool,
  apiEndpoints: PropTypes.array.isRequired,
  apiEndpointsPending: PropTypes.bool.isRequired,
  containerInstances: PropTypes.array,
  showAPIEndpointWizardModal: PropTypes.func.isRequired,
  secretsDropDown: PropTypes.array.isRequired,
};

ContainerForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
  inlineMode: false,
  containerInstances: [],
  entitlementActions: {}
};

// Connect to this forms state in the store so we can enum the values
const selector = form => formValueSelector(form);
export default connect(
  (state, props) => ({
    values: selector(props.form)(state,
      'properties.force_pull',
      'properties.provider',
      'properties.network',
      'properties.secrets',
      'properties.port_mappings',
      'properties.volumes',
      'properties.health_checks',
      'properties.num_instances',
      'properties.env',
      'properties.labels',
    ),
  })
)(ContainerForm);
