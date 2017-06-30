import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import { Link } from 'react-router-dom';
import { merge } from 'lodash';
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
import { VariablesForm } from 'modules/Variables';
import { VolumeModal, VolumeListing } from 'modules/VolumeModal';
import { PortMapModal, PortMapListing } from 'modules/PortMappingModal';
import { HealthCheckModal, HealthCheckListing } from 'modules/HealthCheckModal';
import { Breadcrumbs } from 'modules/ContextManagement';
import { Button, CopyUUIDButton } from 'components/Buttons';
import ContainerDetails from '../ContainerDetails';
import { nameMaxLen } from '../../validations';
import ContainerActions from '../ContainerActions';

const ListButton = styled(Button)`
  margin-left: 1.7em;
  margin-bottom: .5em;
`;

const ContainerForm = (props) => {
  const { values, match, container } = props;

  const selectedProvider = merge({ properties: { config: { networks: [] } } },
    props.providersByType.find(provider => values.properties.provider.id === provider.id));

  const fetchProviders = () => {
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.environmentId ? 'environments' : 'workspaces';

    props.fetchProvidersByType(match.params.fqon, entityId, entityKey, 'CaaS');
  };

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card
            className={props.inlineMode ? 'flex-12 md-no-paper' : 'flex-10 flex-xs-12 flex-sm-12'}
            expanderTooltipLabel="Configure for Redeploy"
            expanderIconChildren="edit"
            primary
            expanderIconClassName="material-icons--primary"
          >
            {!props.inlineMode &&
            <CardTitle
              expander={container.id}
              title={
                <div>
                  <span>{props.title}</span>
                  {props.editMode &&
                    <ContainerActions
                      inContainerView
                      containerModel={container}
                      {...props}
                    />}
                  <div className="md-caption"><Breadcrumbs /> / Container</div>
                </div>
              }
              subtitle={container.id &&
                <div className="flex-row no-gutter">
                  <div className="flex-12">
                    <CopyUUIDButton
                      showUUID
                      model={container}
                    />
                  </div>
                  {/* <div className="flex-12">
                    <Button
                      label="Entitlements"
                      flat
                      onClick={() => props.showEntitlementsModal(props.title, props.match.params)}
                    >
                      security
                    </Button>
                  </div> */}
                </div>
              }
            />}
            <CardText expandable={container.id}>
              <div className="flex-row">
                <Field
                  id="select-provider"
                  className="flex-5 flex-xs-12"
                  component={SelectField}
                  name="properties.provider.id"
                  required
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  menuItems={props.providersByType}
                  onFocus={() => fetchProviders()}
                  async
                  disabled={container.id}
                />
                {values.properties.provider.id &&
                <div className="flex-row">
                  <Field
                    className="flex-5 flex-xs-12"
                    component={TextField}
                    name="name"
                    label="Name"
                    type="text"
                    required
                    maxLength={nameMaxLen}
                  />
                  <Field
                    className="flex-7 flex-xs-12"
                    component={TextField}
                    name="description"
                    label="Description"
                    type="text"
                  />
                  <Field
                    className="flex-5 flex-xs-12"
                    component={TextField}
                    name="properties.image"
                    label="Image"
                    type="text"
                    required
                  />
                  <Field
                    id="select-network"
                    className="flex-4 flex-xs-12"
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
                  <Field
                    className="flex-1 flex-xs-12"
                    component={TextField}
                    name="properties.num_instances"
                    min={1}
                    max={999}
                    step={1}
                    label="Instances"
                    type="number"
                    required
                    parse={value => Number(value)}  // redux form formats everything as string, so force number
                  />
                  <Field
                    className="flex-1 flex-xs-12"
                    component={TextField}
                    name="properties.cpus"
                    min={0.1}
                    max={4.0}
                    step={0.1}
                    label="CPU"
                    type="number"
                    required
                    parse={value => Number(value)}  // redux form formats everything as string, so force number
                  />
                  <Field
                    className="flex-1 flex-xs-12"
                    component={TextField}
                    name="properties.memory"
                    min={32}
                    max={8096}
                    step={1}
                    label="Memory"
                    type="number"
                    required
                    parse={value => Number(value)}  // redux form formats everything as string, so force number
                  />
                  <Field
                    className="flex-5 flex-xs-12"
                    component={TextField}
                    name="properties.cmd"
                    label="Command"
                    type="text"
                  />
                  <Field
                    id="force_pull"
                    className="flex-4 flex-xs-12"
                    component={Checkbox}
                    name="properties.force_pull"
                    // TODO: Find out why redux-form state for bool doesn't apply
                    checked={values.properties.force_pull}
                    label="Force Pull Image on Every Launch"
                  />
                </div>}
              </div>

            </CardText>
            {(props.containerUpdatePending || props.containerPending) && <LinearProgress id="container-form-loading" />}
            {!props.inlineMode &&
            <CardActions className="flex-row no-gutter">
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.containerPending || props.submitting}
                component={Link}
                to={`/${props.match.params.fqon}/hierarchy/${props.match.params.workspaceId}/environments/${props.match.params.environmentId}`}
              />
              <Button
                raised
                label={props.submitLabel}
                type="submit"
                disabled={container.id ? props.containerPending || props.containerUpdatePending || props.invalid || props.submitting : props.pristine || props.containerPending || props.containerUpdatePending || props.invalid || props.submitting}
                primary
              />
            </CardActions>}
          </Card>

          {values.properties.provider.id &&
          <div className="flex-row center-center no-gutter">
            {props.editMode &&
            <Card className={props.inlineMode ? 'flex-12' : 'flex-10 flex-xs-12 flex-sm-12'}>
              <div className="flex-row">
                <div className="flex">
                  <ContainerDetails containerModel={props.container} match={props.match} />
                </div>
              </div>
            </Card>}

            <ExpansionList className={props.inlineMode ? 'flex-12' : 'flex-10 flex-xs-12 flex-sm-12'}>
              {!values.properties.network ? <div /> :
              <ExpansionPanelNoPadding label={<h3>Port Mappings</h3>} saveLabel="Collapse" defaultExpanded={values.properties.port_mappings.length > 0}>
                <div className="flex-row no-gutter">
                  <div className="flex">
                    <PortMapModal networkType={values.properties.network} />
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
                  </div>
                </div>
              </ExpansionPanelNoPadding>}

              <ExpansionPanelNoPadding label={<h3>Volumes</h3>} saveLabel="Collapse" defaultExpanded={values.properties.volumes.length > 0}>
                <div className="flex-row no-gutter">
                  <div className="flex">
                    <VolumeModal />
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
                  </div>
                </div>
              </ExpansionPanelNoPadding>

              <ExpansionPanel label={<h3>Variables</h3>} saveLabel="Collapse" defaultExpanded={values.variables && values.variables.length > 0}>
                <div className="flex-row no-gutter">
                  <div className="flex-12">
                    <VariablesForm icon="add" {...props} />
                  </div>
                </div>
              </ExpansionPanel>

              <ExpansionPanel label={<h3>Labels</h3>} saveLabel="Collapse" defaultExpanded={values.labels && values.labels.length > 0}>
                <div className="flex-row no-gutter">
                  <div className="flex-12">
                    <VariablesForm addButtonLabel="Label" icon="add" fieldName="labels" {...props} />
                  </div>
                </div>
              </ExpansionPanel>

              <ExpansionPanelNoPadding label={<h3>Health Checks</h3>} saveLabel="Collapse" defaultExpanded={values.properties.health_checks.length > 0}>
                <div className="flex-row no-gutter">
                  <div className="flex">
                    <HealthCheckModal />
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
                  </div>
                </div>
              </ExpansionPanelNoPadding>

              <ExpansionPanel label={<h3>Optional</h3>}saveLabel="Collapse">
                <Field
                  className="flex-5 flex-xs-12"
                  component={TextField}
                  name="properties.constraints"
                  label="Constraints"
                  type="text"
                  helpText="Comma delimited set of constraints e.g. <field name>:<LIKE | UNLIKE | UNIQUE | CLUSTER | GROUP_BY | MAX_PER>:<optional param>, ..."
                />
                <Field
                  className="flex-5 flex-xs-12"
                  component={TextField}
                  name="properties.accepted_resource_roles"
                  label="Resource Roles"
                  type="text"
                  helpText="Comma delimited set of resource roles"
                />
                <Field
                  className="flex-3 flex-xs-12"
                  component={TextField}
                  name="properties.user"
                  label="User"
                  type="text"
                  helpText="unix formatted username"
                />
              </ExpansionPanel>
            </ExpansionList>
          </div>}
        </div>
      </form>
    </div>
  );
};

ContainerForm.propTypes = {
  fetchProvidersByType: PropTypes.func.isRequired,
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
