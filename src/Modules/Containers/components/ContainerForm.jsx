import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, FieldArray, formValueSelector } from 'redux-form';
import { Link } from 'react-router-dom';
import { merge } from 'lodash';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import { Card, CardTitle, CardText, LinearProgress } from 'react-md';
import { Checkbox, SelectField, TextField } from 'components/ReduxFormFields';
import { UnixVariablesForm, LabelsForm } from 'Modules/Variables';
import { VolumeModal, VolumeListing } from 'Modules/VolumeModal';
import { HealthCheckModal, HealthCheckListing } from 'Modules/HealthCheckModal';
import { SecretsPanelModal, SecretsPanelList } from 'Modules/Secrets';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { Panel } from 'components/Panels';
import AceEditor from 'components/AceEditor';
import A from 'components/A';
import { Caption } from 'components/Typography';
import { getLastFromSplit } from 'util/helpers/strings';
import ContainerInstances from './ContainerInstances';
import ContainerServiceAddresses from './ContainerServiceAddresses';
import { nameMaxLen, descriptionMaxLen } from '../validations';
import ContainerActions from './ContainerActions';
import ContainerIcon from './ContainerIcon';
import ActionsModals from '../ActionModals';
import PortMappingsForm from './PortMappingsForm';

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
    props.editMode ? (props.containerPending || props.invalid || props.submitting)
      : (props.pristine || props.containerPending || props.invalid || props.submitting);

  const hasInstances = props.containerInstances.length > 0;
  const hasServiceAddresses = props.containerServiceAddresses.length > 0 && props.containerServiceAddresses.some(p => p.service_address);

  return (
    <div>
      <ActionsModals />
      {/* <PortMapModal networkType={values.properties.network} /> */}
      <VolumeModal providerType={providerType} />
      <HealthCheckModal />
      <SecretsPanelModal providerId={selectedProvider.id} providerType={providerType} />
      {props.editMode &&
        <Row gutter={5} center>
          <Col flex={props.inlineMode ? 12 : 10} xs={12} sm={12} md={12}>
            <DetailsPane model={container} noShadow={props.inlineMode} />
          </Col>
        </Row>}
      <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <Row gutter={5} center>
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
                      <div className="gf-headline-1">
                        <ContainerIcon resourceType={providerType} /> {selectedProvider.name}
                      </div>}
                  </div>
                }
              />
              {!props.inlineMode &&
                <ActionsToolbar>
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
                    <ContainerActions
                      inContainerView
                      containerModel={container}
                      disableDestroy={props.inlineMode}
                      disablePromote={props.inlineMode}
                    />}
                </ActionsToolbar>}
              {!props.inlineMode && props.containerPending && <LinearProgress id="container-form-loading" />}

              <CardText>
                <Row gutter={5}>
                  {!values.properties.provider.id &&
                    <Col flex={12} xs={12}>
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
                    </Col>}
                  {values.properties.provider.id &&
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
                      />
                    </Col>
                    <Col flex={6} xs={12}>
                      <Field
                        id="select-network"
                        component={SelectField}
                        name="properties.network"
                        menuItems={selectedProvider.properties.config.networks}
                        disabled={!selectedProvider.properties.config.networks.length}
                        label={!selectedProvider.properties.config.networks.length ? 'No Configured Networks' : 'Network'}
                        itemLabel="name"
                        itemValue="name"
                        required
                        helpText="Select a network to configure port mappings"
                      />
                    </Col>
                    <Col flex={6} xs={12} sm={12}>
                      <Panel title="Resources" minHeight="13.75em">
                        <Row gutter={5}>
                          <Col flex={9} xs={12}>
                            <Field
                              component={TextField}
                              name="properties.image"
                              label="Image"
                              type="text"
                              required
                            />
                          </Col>
                          <Col flex={3} xs={12} sm={12}>
                            <Field
                              id="force_pull"
                              component={Checkbox}
                              name="properties.force_pull"
                              // TODO: Find out why redux-form state for bool doesn't apply
                              checked={values.properties.force_pull}
                              label="Force Pull Image"
                            />
                          </Col>
                          <Col flex={3} xs={12}>
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
                          <Col flex={3} xs={12}>
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
                          <Col flex={3} xs={12}>
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
                        </Row>
                      </Panel>
                    </Col>
                    <Col flex={6} xs={12} sm={12}>
                      <Panel title="Command" noPadding>
                        <Field
                          component={AceEditor}
                          mode="sh"
                          theme="chrome"
                          name="properties.cmd"
                          maxLines={12}
                          minLines={12}
                        />
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

                    {props.editMode &&
                    <Col flex={12}>
                      <Panel title="Public Endpoints" pending={props.apiEndpointsPending}>
                        {props.apiEndpoints.map(a => <A href={a.properties.public_url} target="_blank" rel="noopener noreferrer" block>{a.properties.public_url}</A>)}
                        {!props.apiEndpoints.length > 0 && !props.apiEndpointsPending && <Caption light large>No Public Endpoints Configured</Caption> }
                      </Panel>
                    </Col>}
                  </Row>}

                  {selectedProvider.id &&
                  <Row gutter={5}>
                    {hasInstances &&
                      <Col flex={6} xs={12} sm={12}>
                        <Panel
                          title={`Instances (${props.containerInstances.length}/${container.properties.num_instances})`}
                          noPadding
                        >
                          <ContainerInstances
                            instances={props.containerInstances}
                            providerType={providerType}
                            containerModel={container}
                          />
                        </Panel>
                      </Col>}
                    {hasServiceAddresses &&
                      <Col flex={6} xs={12} sm={12}>
                        <Panel title="Service Instances" noPadding>
                          <ContainerServiceAddresses
                            serviceAddresses={props.containerServiceAddresses}
                          />
                        </Panel>
                      </Col>
                    }

                    {values.properties.network &&
                    <Col flex={12}>
                      <Panel
                        title="Port Mappings"
                        noPadding
                        defaultExpanded={values.properties.port_mappings.length > 0}
                      >
                        <FieldArray
                          name="properties.port_mappings"
                          component={PortMappingsForm}
                          networkType={values.properties.network}
                          portMappingFormValues={values.properties.port_mappings}
                        />
                      </Panel>
                    </Col>}

                    <Col flex={12}>
                      <Panel title="Volumes" noPadding defaultExpanded={values.properties.volumes.length > 0}>
                        <ListButton
                          id="volume-modes"
                          flat
                          iconBefore
                          primary
                          label="Volume"
                          onClick={props.showVolumeModal}
                        >
                          add
                        </ListButton>
                        <VolumeListing editMode={props.editMode} mergeVolumes={values.properties.volumes} />
                      </Panel>
                    </Col>

                    {isSecretsEnabled &&
                    <Col flex={12}>
                      <Panel title="Secrets" noPadding defaultExpanded={values.properties.secrets.length > 0}>
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

                    <Col flex={12}>
                      <Panel title="Environment Variables" defaultExpanded={values.properties.env.length > 0} noPadding>
                        <FieldArray
                          component={UnixVariablesForm}
                          name="properties.env"
                        />
                      </Panel>
                    </Col>

                    <Col flex={12}>
                      <Panel title="Labels" defaultExpanded={values.properties.labels.length > 0} noPadding>
                        <FieldArray
                          component={LabelsForm}
                          name="properties.labels"
                        />
                      </Panel>
                    </Col>

                    {/* TODO: Implement for Kubernetes/Docker when api is ready */}
                    {isHealthChecksEnabled &&
                    <Col flex={12}>
                      <Panel title="Health Checks" noPadding defaultExpanded={values.properties.health_checks.length > 0}>
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
                      <Panel title="Optional" defaultExpanded={false}>
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
                </Row>
              </CardText>
            </Card>
          </Col>
        </Row>
      </form>
    </div>
  );
};

ContainerForm.propTypes = {
  fetchProvidersByType: PropTypes.func.isRequired,
  showSecretModal: PropTypes.func.isRequired,
  showVolumeModal: PropTypes.func.isRequired,
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
  // showEntitlementsModal: PropTypes.func.isRequired,
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
};

ContainerForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
  inlineMode: false,
  containerInstances: [],
  containerServiceAddresses: [],
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
