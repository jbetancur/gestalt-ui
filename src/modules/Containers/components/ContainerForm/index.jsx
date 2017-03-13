import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import { Link } from 'react-router';
import Button from 'react-md/lib/Buttons/Button';
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
import { NetworkModal, NetworkListing } from 'modules/NetworkModal';
import { HealthCheckModal, HealthCheckListing } from 'modules/HealthCheckModal';
import Breadcrumbs from 'modules/Breadcrumbs';
import ContainerDetails from '../ContainerDetails';
import { nameMaxLen } from '../../validations';
import ContainerActions from '../ContainerActions';

const ContainerForm = (props) => {
  const { values, params, container } = props;
  const selectedProvider = props.providers
    .find(provider => values.properties.provider.id === provider.id)
    || { properties: { config: { networks: [] } } };

  const fetchProviders = () => {
    props.fetchProviders(params.fqon, params.environmentId, 'Marathon');
  };

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className={props.inlineMode ? 'flex-12 md-no-paper' : 'flex-10 flex-xs-12 flex-sm-12'}>
            {props.inlineMode ? null :
            <CardTitle
              title={
                <div>
                  <span>{props.title}</span>{!props.editMode ? null : <ContainerActions inContainerView container={container} {...props} />}
                  <div className="md-caption"><Breadcrumbs /> / Container</div>
                </div>
              }
              subtitle={container.id ? container.id : null}
            />}
            <CardText>
              <div className="flex-row">
                <Field
                  id="select-provider"
                  className="flex-4 flex-xs-12"
                  component={SelectField}
                  name="properties.provider.id"
                  required
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  errorText={props.touched && props.error}
                  menuItems={props.providers}
                  onFocus={() => fetchProviders()}
                  disabled={container.id}
                />
                {!values.properties.provider.id ? null :
                <div className="flex-row">
                  <Field
                    className="flex-3 flex-xs-12"
                    component={TextField}
                    name="name"
                    label="Name"
                    type="text"
                    required
                    errorText={props.touched && props.error}
                    maxLength={nameMaxLen}
                    lineDirection="center"
                  />
                  <Field
                    className="flex-9 flex-xs-12"
                    component={TextField}
                    name="description"
                    label="Description"
                    type="text"
                    lineDirection="center"
                  />
                  <Field
                    id="select-network"
                    className="flex-3 flex-xs-12"
                    component={SelectField}
                    name="properties.network"
                    menuItems={selectedProvider.properties.config.networks}
                    disabled={!selectedProvider.properties.config.networks.length}
                    label={!selectedProvider.properties.config.networks.length ? 'No Available Networks' : 'Network'}
                    itemLabel="name"
                    itemValue="name"
                    required
                    errorText={props.touched && props.error}
                  />
                  <Field
                    className="flex-6 flex-xs-12"
                    component={TextField}
                    name="properties.image"
                    label="Image"
                    type="text"
                    required
                    errorText={props.touched && props.error}
                    lineDirection="center"
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
                    errorText={props.touched && props.error}
                    lineDirection="center"
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
                    errorText={props.touched && props.error}
                    lineDirection="center"
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
                    errorText={props.touched && props.error}
                    lineDirection="center"
                    parse={value => Number(value)}  // redux form formats everything as string, so force number
                  />
                  <Field
                    className="flex-5 flex-xs-12"
                    component={TextField}
                    name="properties.cmd"
                    label="Command"
                    type="text"
                    lineDirection="center"
                  />
                  <Field
                    id="force_pull"
                    className="flex-3 flex-xs-12"
                    component={Checkbox}
                    name="properties.force_pull"
                    // TODO: Find out why redux-form state for bool doesn't apply
                    checked={values.properties.force_pull}
                    label="Force Pull Image on Every Launch"
                  />
                </div>}

              </div>

            </CardText>
            {props.containerUpdatePending || props.pending ? <LinearProgress id="container-form-loading" /> : null}
            {props.inlineMode ? null :
            <CardActions>
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.pending || props.submitting}
                component={Link}
                to={{
                  pathname: `${props.params.fqon}/workspaces/${props.params.workspaceId}/environments/${props.params.environmentId}`
                }}
              />
              <Button
                raised
                label={props.submitLabel}
                type="submit"
                disabled={props.pristine || props.pending || props.containerUpdatePending || props.invalid || props.submitting}
                primary
              />
            </CardActions>}
          </Card>

          {!values.properties.provider.id ? null :
          <div className="flex-row center-center">
            <ExpansionList className={props.inlineMode ? 'flex-12' : 'flex-10 flex-xs-12 flex-sm-12'}>
              {!props.editMode ? <div /> : // react-md bug where expansion list children cannot be null
              <ExpansionPanelNoPadding label={<h3>Container Details</h3>} saveLabel="Collapse" defaultExpanded>
                <div className="flex-row">
                  <div className="flex-12">
                    <ContainerDetails container={props.container} />
                  </div>
                </div>
              </ExpansionPanelNoPadding>}

              {!values.properties.network ? <div /> :
              <ExpansionPanelNoPadding label={<h3>Port Mappings</h3>} saveLabel="Collapse">
                <div className="flex-row">
                  <div className="flex-12">
                    <NetworkModal networkType={values.properties.network} />
                    <Button
                      id="port-mappings"
                      flat
                      iconBefore
                      primary
                      label="Add Port Mapping"
                      onClick={() => props.showNetworkModal()}
                    >
                      settings_ethernet
                    </Button>
                    <NetworkListing editMode={props.editMode} mergeNetworks={values.properties.port_mappings} />
                  </div>
                </div>
              </ExpansionPanelNoPadding>}

              <ExpansionPanelNoPadding label={<h3>Volumes</h3>} saveLabel="Collapse">
                <div className="flex-row">
                  <div className="flex-12">
                    <VolumeModal />
                    <Button
                      id="volume-modes"
                      flat
                      iconBefore
                      primary
                      label="Add Volume"
                      onClick={() => props.showVolumeModal()}
                    >
                      storage
                    </Button>
                    <VolumeListing editMode={props.editMode} mergeVolumes={values.properties.volumes} />
                  </div>
                </div>
              </ExpansionPanelNoPadding>

              <ExpansionPanel label={<h3>Variables</h3>} saveLabel="Collapse">
                <div className="flex-row">
                  <div className="flex-12">
                    <VariablesForm icon="list" {...props} />
                  </div>
                </div>
              </ExpansionPanel>

              <ExpansionPanel label={<h3>Labels</h3>} saveLabel="Collapse">
                <div className="flex-row">
                  <div className="flex-12">
                    <VariablesForm addButtonLabel="Add Label" icon="label" fieldName="labels" {...props} />
                  </div>
                </div>
              </ExpansionPanel>

              <ExpansionPanelNoPadding label={<h3>Health Checks</h3>} saveLabel="Collapse">
                <div className="flex-row">
                  <div className="flex-12">
                    <HealthCheckModal />
                    <Button
                      id="health-checks"
                      flat
                      iconBefore
                      primary
                      label="Add Health Check"
                      onClick={() => props.showHealthCheckModal()}
                    >
                      mood
                    </Button>
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
                  errorText={props.touched && props.error}
                  lineDirection="center"
                  helpText="Comma delimited set of constraints"
                />
                <Field
                  className="flex-5 flex-xs-12"
                  component={TextField}
                  name="properties.accepted_resource_roles"
                  label="Resource Roles"
                  type="text"
                  errorText={props.touched && props.error}
                  lineDirection="center"
                  helpText="Comma delimited set of resource roles"
                />
                <Field
                  className="flex-3 flex-xs-12"
                  component={TextField}
                  name="properties.user"
                  label="User"
                  type="text"
                  errorText={props.touched && props.error}
                  lineDirection="center"
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
  fetchProviders: PropTypes.func.isRequired,
  showVolumeModal: PropTypes.func.isRequired,
  showNetworkModal: PropTypes.func.isRequired,
  showHealthCheckModal: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
  containerUpdatePending: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  providers: PropTypes.array.isRequired,
  container: PropTypes.object.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
  inlineMode: PropTypes.bool
};

ContainerForm.defaultProps = {
  touched: false,
  error: false,
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
