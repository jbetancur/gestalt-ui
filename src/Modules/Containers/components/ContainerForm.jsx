import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import { Link } from 'react-router-dom';
import { merge } from 'lodash';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { ExpansionList } from 'react-md/lib/ExpansionPanels';
import { ExpansionPanelNoPadding, ExpansionPanel } from 'components/ExpansionList';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import Checkbox from 'components/Checkbox';
import { VariablesForm } from 'Modules/Variables';
import { VolumeModal, VolumeListing } from 'Modules/VolumeModal';
import { PortMapModal, PortMapListing } from 'Modules/PortMappingModal';
import { HealthCheckModal, HealthCheckListing } from 'Modules/HealthCheckModal';
import { SecretsPanelModal, SecretsPanelList } from 'Modules/Secrets';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import { parseChildClass } from 'util/helpers/strings';
import { isUnixVariable } from 'util/validations';
import ContainerInstances from './ContainerInstances';
import ContainerServiceAddresses from './ContainerServiceAddresses';
import { nameMaxLen } from '../validations';
import ContainerActions from './ContainerActions';
import ContainerIcon from './ContainerIcon';
import ActionsModals from '../ActionModals';

const fixInputNumber = value => value && parseInt(value, 10);
const ListButton = styled(Button)`
  margin-left: 1.7em;
  margin-bottom: .5em;
`;

const ContainerForm = (props) => {
  const { values, match, container } = props;
  const entityId = match.params.environmentId || match.params.workspaceId || null;
  const entityKey = match.params.workspaceId && match.params.environmentId ? 'environments' : 'workspaces';

  const selectedProvider = merge({ properties: { config: { networks: [] } } },
    props.providersByType.find(provider => values.properties.provider.id === provider.id));

  const populateProviders = () => {
    props.fetchProvidersByType(match.params.fqon, entityId, entityKey, 'CaaS');
  };

  // TODO: Remove when Kubernetes/Docker when api is ready
  const providerType = parseChildClass(selectedProvider.resource_type);
  const isHealthChecksEnabled = parseChildClass(providerType) === 'DCOS';
  const isSecretsEnabled = parseChildClass(providerType) === 'Kubernetes';
  const isSubmitDisabled =
    container.id ? (props.containerPending || props.containerUpdatePending || props.invalid || props.submitting)
      : (props.pristine || props.containerPending || props.containerUpdatePending || props.invalid || props.submitting);

  return (
    <div>
      <ActionsModals />
      <PortMapModal networkType={values.properties.network} />
      <VolumeModal providerType={parseChildClass(providerType)} />
      <HealthCheckModal />
      <SecretsPanelModal providerId={selectedProvider.id} />
      {container.id && props.editMode &&
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12}>
            <DetailsPane model={container} />
          </Col>
        </Row>}
      <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <Row gutter={5} center>
          <Col
            flex={props.inlineMode ? 12 : 10}
            xs={12}
            sm={12}
          >
            <Card
              className={props.inlineMode ? 'md-no-paper' : ''}
            >
              {!props.inlineMode &&
              <CardTitle
                title={
                  <div>
                    <div>{props.title}</div>
                    {props.editMode &&
                      <ContainerActions
                        inContainerView
                        containerModel={container}
                        {...props}
                      />}
                    {selectedProvider.id &&
                      <div className="gf-headline-1">
                        <ContainerIcon resourceType={providerType} /> {selectedProvider.name}
                      </div>}
                  </div>
                }
              />}
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
                        onFocus={populateProviders}
                        async
                      />
                    </Col>}
                  {values.properties.provider.id &&
                  <Row gutter={5}>
                    <Col flex={5} xs={12}>
                      <Field
                        component={TextField}
                        name="name"
                        label="Name"
                        type="text"
                        required
                        maxLength={nameMaxLen}
                        disabled={container.id}
                      />
                    </Col>
                    <Col flex={7} xs={12}>
                      <Field
                        component={TextField}
                        name="description"
                        label="Description"
                        type="text"
                        rows={1}
                      />
                    </Col>
                    <Col flex={5} xs={12}>
                      <Field
                        component={TextField}
                        name="properties.image"
                        label="Image"
                        type="text"
                        required
                      />
                    </Col>
                    <Col flex={4} xs={12}>
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
                    <Col flex={1} xs={12}>
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
                    <Col flex={1} xs={12}>
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
                    <Col flex={1} xs={12}>
                      <Field
                        component={TextField}
                        name="properties.memory"
                        min={32}
                        max={8096}
                        step={1}
                        label="Memory"
                        type="number"
                        required
                        normalize={fixInputNumber}
                      />
                    </Col>
                    <Col flex={5} xs={12}>
                      <Field
                        component={TextField}
                        name="properties.cmd"
                        label="Command"
                        type="text"
                      />
                    </Col>
                    <Col flex={4} xs={12}>
                      <Field
                        id="force_pull"
                        component={Checkbox}
                        name="properties.force_pull"
                        // TODO: Find out why redux-form state for bool doesn't apply
                        checked={values.properties.force_pull}
                        label="Force Pull Image on Every Launch"
                      />
                    </Col>
                  </Row>}
                </Row>
              </CardText>
              {(props.containerUpdatePending || props.containerPending) && <LinearProgress id="container-form-loading" />}
              {!props.inlineMode &&
              <CardActions>
                <Button
                  flat
                  disabled={props.containerPending || props.submitting}
                  component={Link}
                  to={`/${props.match.params.fqon}/hierarchy/${props.match.params.workspaceId}/environments/${props.match.params.environmentId}`}
                >
                  {props.cancelLabel}
                </Button>
                {selectedProvider.id &&
                  <Button
                    raised
                    type="submit"
                    disabled={isSubmitDisabled}
                    primary
                  >
                    {props.submitLabel}
                  </Button>}
              </CardActions>}
            </Card>
          </Col>
        </Row>

        {(props.editMode && container.properties.instances.length > 0) &&
          <Row gutter={5} center>
            <Col
              flex={props.inlineMode ? 12 : 10}
              xs={12}
              sm={12}
            >
              <Card>
                <ContainerInstances
                  containerModel={props.container}
                  match={props.match}
                  providerType={providerType}
                />
              </Card>
            </Col>
            <Col
              flex={props.inlineMode ? 12 : 10}
              xs={12}
              sm={12}
            >
              <Card>
                <ContainerServiceAddresses
                  containerModel={props.container}
                />
              </Card>
            </Col>
          </Row>}

        {selectedProvider.id &&
          <Row gutter={5} center>
            <Col
              flex={props.inlineMode ? 12 : 10}
              xs={12}
              sm={12}
            >
              <ExpansionList>
                {!values.properties.network ?
                  <div /> :
                  <ExpansionPanelNoPadding label={<h3>Port Mappings</h3>} defaultExpanded={values.properties.port_mappings.length > 0} footer={null}>
                    <Row>
                      <Col flex>
                        <ListButton
                          id="port-mappings"
                          flat
                          iconBefore
                          primary
                          label="Port Mapping"
                          onClick={() => props.showPortmapModal()}
                        >
                          add
                        </ListButton>
                        <PortMapListing editMode={props.editMode} mergePortMappings={values.properties.port_mappings} {...props} />
                      </Col>
                    </Row>
                  </ExpansionPanelNoPadding>}

                <ExpansionPanelNoPadding label={<h3>Volumes</h3>} defaultExpanded={values.properties.volumes.length > 0} footer={null}>
                  <Row>
                    <Col flex>
                      <ListButton
                        id="volume-modes"
                        flat
                        iconBefore
                        primary
                        label="Volume"
                        onClick={() => props.showVolumeModal()}
                      >
                        add
                      </ListButton>
                      <VolumeListing editMode={props.editMode} mergeVolumes={values.properties.volumes} />
                    </Col>
                  </Row>
                </ExpansionPanelNoPadding>

                {isSecretsEnabled ?
                  <ExpansionPanelNoPadding label={<h3>Secrets</h3>} defaultExpanded={values.properties.secrets.length > 0} footer={null}>
                    <Row>
                      <Col flex>
                        <ListButton
                          id="secret-modal"
                          flat
                          iconBefore
                          primary
                          label="Secret"
                          onClick={() => props.showSecretModal()}
                        >
                          add
                        </ListButton>
                        <SecretsPanelList editMode={props.editMode} mergeSecrets={values.properties.secrets} />
                      </Col>
                    </Row>
                  </ExpansionPanelNoPadding> : <div />}

                <ExpansionPanel label={<h3>Environment Variables</h3>} defaultExpanded={values.properties.env.length > 0} footer={null}>
                  <Row>
                    <Col flex={12}>
                      <VariablesForm
                        icon="add"
                        fieldName="properties.env"
                        keyFieldValidationFunction={isUnixVariable}
                        keyFieldValidationMessage="must be a unix variable name"
                        {...props}
                      />
                    </Col>
                  </Row>
                </ExpansionPanel>

                <ExpansionPanel label={<h3>Labels</h3>} defaultExpanded={values.properties.labels.length > 0} footer={null}>
                  <Row>
                    <Col flex={12}>
                      <VariablesForm addButtonLabel="Label" icon="add" fieldName="properties.labels" {...props} />
                    </Col>
                  </Row>
                </ExpansionPanel>

                {/* TODO: Implement for Kubernetes/Docker when api is ready */}
                {isHealthChecksEnabled ?
                  <ExpansionPanelNoPadding label={<h3>Health Checks</h3>} defaultExpanded={values.properties.health_checks.length > 0} footer={null}>
                    <Row>
                      <Col flex>
                        <ListButton
                          id="health-checks"
                          flat
                          iconBefore
                          primary
                          label="Health Check"
                          onClick={() => props.showHealthCheckModal()}
                        >
                          add
                        </ListButton>
                        <HealthCheckListing editMode={props.editMode} mergeHealthChecks={values.properties.health_checks} />
                      </Col>
                    </Row>
                  </ExpansionPanelNoPadding> : <div />}

                <ExpansionPanel label={<h3>Optional</h3>} footer={null}>
                  <Row>
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
                  </Row>
                </ExpansionPanel>
              </ExpansionList>
            </Col>
          </Row>}
      </form>
    </div>
  );
};

ContainerForm.propTypes = {
  fetchProvidersByType: PropTypes.func.isRequired,
  showSecretModal: PropTypes.func.isRequired,
  showVolumeModal: PropTypes.func.isRequired,
  showPortmapModal: PropTypes.func.isRequired,
  showHealthCheckModal: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  containerPending: PropTypes.bool.isRequired,
  containerUpdatePending: PropTypes.bool,
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
  inlineMode: PropTypes.bool
};

ContainerForm.defaultProps = {
  containerUpdatePending: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
  inlineMode: false,
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(ContainerForm);
