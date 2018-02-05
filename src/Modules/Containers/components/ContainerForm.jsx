import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, FieldArray, formValueSelector } from 'redux-form';
import { Link } from 'react-router-dom';
import { merge } from 'lodash';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import { Card, CardTitle, CardText } from 'react-md';
import ActivityContainer from 'components/ActivityContainer';
import Form from 'components/Form';
import { Checkbox, SelectField, TextField, AceEditor } from 'components/ReduxFormFields';
import { UnixVariablesForm, LabelsForm } from 'Modules/Variables';
import { HealthCheckModal, HealthCheckListing } from 'Modules/HealthCheckModal';
import { SecretsPanelModal, SecretsPanelList } from 'Modules/Secrets';
import { APIEndpointInlineList } from 'Modules/APIEndpoints';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { Panel } from 'components/Panels';
import { Title } from 'components/Typography';
import { getLastFromSplit } from 'util/helpers/strings';
import ContainerInstances from './ContainerInstances';
import ContainerServiceAddresses from './ContainerServiceAddresses';
import { nameMaxLen, descriptionMaxLen } from '../validations';
import ContainerActions from './ContainerActions';
import ContainerIcon from './ContainerIcon';
import ActionsModals from '../ActionModals';
import PortMappingsForm from './PortMappingsForm';
import VolumesForm from './VolumesForm';

const fixInputNumber = value => value && parseInt(value, 10);
const ListButton = styled(Button)`
  margin-top: 8px;
  margin-left: 16px;
  margin-bottom: 8px;
`;

const ContainerForm = ({ values, container, ...props }) => {
  const selectedProvider = merge({ properties: { config: { networks: [] } } },
    props.providersByType.find(provider => values.properties.provider.id === provider.id));

  // TODO: Remove when Kubernetes/Docker when api is ready
  const providerType = getLastFromSplit(selectedProvider.resource_type);
  const isHealthChecksEnabled = providerType !== 'Docker';
  const isSecretsEnabled = providerType !== 'Docker' || selectedProvider.properties.config.secret_support;
  const isSubmitDisabled =
    props.editMode ? (props.containerPending || props.submitting)
      : (props.pristine || props.containerPending || props.submitting);

  const hasInstances = props.containerInstances.length > 0;
  const hasServiceAddresses = props.containerServiceAddresses.length > 0 && props.containerServiceAddresses.some(p => p.service_address);
  const isPending = !props.inlineMode && props.containerPending;

  return (
    <div>
      <ActionsModals />
      <HealthCheckModal />
      <SecretsPanelModal providerId={selectedProvider.id} providerType={providerType} />
      <Form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off" disabled={isPending}>
        <Row gutter={5} center>
          {props.editMode &&
            <Col flex={props.inlineMode ? 12 : 10}>
              <DetailsPane model={container} />
            </Col>}
          <Col
            flex={props.inlineMode ? 12 : 10}
            xs={12}
            sm={12}
            md={12}
          >
            <Card className={props.inlineMode ? 'md-no-paper' : ''}>
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
              {!props.inlineMode &&
                <ActionsToolbar>
                  <Row>
                    <Col flex={12}>
                      <Button
                        flat
                        iconChildren="arrow_back"
                        disabled={props.containerPending || props.submitting}
                        component={Link}
                        to={`/${props.match.params.fqon}/hierarchy/${props.match.params.workspaceId}/environment/${props.match.params.environmentId}/containers`}
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
                      {props.editMode &&
                        <Button
                          key="container--entitlements"
                          flat
                          iconChildren="security"
                          onClick={() => props.entitlementActions.showEntitlementsModal(props.title, props.match.params.fqon, container.id, 'containers', 'Container')}
                        >
                          Container Entitlements
                        </Button>}
                      {props.editMode &&
                        <ContainerActions
                          inContainerView
                          containerModel={container}
                          disableDestroy={props.inlineMode}
                          disablePromote={props.inlineMode}
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
                          count={props.containerServiceAddresses && props.containerServiceAddresses.length}
                        >
                          <ContainerServiceAddresses
                            serviceAddresses={props.containerServiceAddresses}
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
                              disabled={props.editMode}
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
                              menuItems={selectedProvider.properties.config.networks}
                              disabled={!selectedProvider.properties.config.networks.length}
                              label={!selectedProvider.properties.config.networks.length ? 'No Configured Network Types' : 'Network Type'}
                              itemLabel="name"
                              itemValue="name"
                              required
                              helpText="Select a network to configure port mappings"
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

                    {/* disabled for provider containers "inline mode" */}
                    {props.editMode && !props.inlineMode &&
                    <Col flex={12}>
                      <Panel
                        title="Public Endpoints"
                        pending={props.apiEndpointsPending}
                        noPadding
                        count={props.apiEndpoints.length}
                      >
                        <APIEndpointInlineList
                          endpoints={props.apiEndpoints}
                          onAddEndpoint={() => props.showAPIEndpointWizardModal(props.match.params, container.id, 'container', values.properties.port_mappings)}
                        />
                      </Panel>
                    </Col>}

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

                    {isSecretsEnabled &&
                    <Col flex={12}>
                      <Panel
                        title="Secrets"
                        noPadding
                        defaultExpanded={values.properties.secrets.length > 0}
                        count={values.properties.secrets.length}
                      >
                        <ListButton
                          id="secret-modal"
                          flat
                          iconBefore
                          primary
                          label="Secret"
                          onClick={props.showSecretModal}
                        >
                          add
                        </ListButton>
                        <SecretsPanelList editMode={props.editMode} mergeSecrets={values.properties.secrets} />
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
                        <ListButton
                          id="health-checks"
                          flat
                          iconBefore
                          primary
                          label="Health Check"
                          onClick={props.showHealthCheckModal}
                        >
                          add
                        </ListButton>
                        <HealthCheckListing editMode={props.editMode} mergeHealthChecks={values.properties.health_checks} />
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
  showSecretModal: PropTypes.func.isRequired,
  showHealthCheckModal: PropTypes.func.isRequired,
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
  containerServiceAddresses: PropTypes.array,
  portMappingFormValues: PropTypes.array.isRequired,
  showAPIEndpointWizardModal: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
};

ContainerForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
  inlineMode: false,
  containerInstances: [],
  containerServiceAddresses: [],
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
