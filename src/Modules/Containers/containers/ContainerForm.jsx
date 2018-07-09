import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, FieldArray, formValueSelector } from 'redux-form';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import { metaModels } from 'Modules/MetaResource';
import Form from 'components/Form';
import { Checkbox, SelectField, TextField, AceEditor } from 'components/ReduxFormFields';
import { UnixVariablesForm, LabelsForm } from 'Modules/Variables';
import { SecretsPanelForm } from 'Modules/Secrets';
import { APIEndpointInlineList } from 'Modules/APIEndpoints';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import { Panel } from 'components/Panels';
import { Caption, Error } from 'components/Typography';
import Div from 'components/Div';
import { Chips } from 'components/Lists';
import { getLastFromSplit } from 'util/helpers/strings';
import { fixInputNumber } from 'util/forms';
import PortMappingsForm from '../components/PortMappingsForm';
import VolumesForm from '../components/VolumesForm';
import HealthChecksForm from '../components/HealthChecksForm';
import SelectProvider from '../components/SelectProvider';

const ContainerForm = ({ match, values, container, containerPending, editMode, inlineMode, change, onSelectedProvider, ...props }) => {
  const selectedProvider = metaModels.provider.get(props.providersData
    .find(provider => values.properties.provider.id === provider.id));

  onSelectedProvider(selectedProvider);

  const isSubmitDisabled =
    editMode ? (containerPending || props.submitting)
      : (props.pristine || containerPending || props.submitting);

  const providerType = getLastFromSplit(selectedProvider.resource_type);
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
  const setNetworks = () => (providerType === 'Kubernetes' ? [{ name: 'default' }] : selectedProvider.properties.config.networks);

  return (
    <Form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off" disabled={isPending}>
      {!values.properties.provider.id
        ?
          <SelectProvider providers={props.providersData} />
        :
          <React.Fragment>
            <Row gutter={5}>
              {editMode && !inlineMode &&
              <Col flex={12}>
                <Panel
                  title="Public Endpoints"
                  pending={props.apiEndpointsPending && !props.apiEndpoints.length}
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

              <Col flex={7} xs={12} sm={12} md={12}>
                <Panel title="Compute" expandable={false} fill>
                  <Row gutter={5}>
                    {!editMode &&
                      <Col flex={6} xs={12}>
                        <Field
                          id="container-name"
                          component={TextField}
                          name="name"
                          label="Container Name"
                          type="text"
                          required
                          helpText="the name of the container"
                        />
                      </Col>}

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
                        parse={value => parseFloat(value)} // redux form formats everything as string, so force number
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

              <Col flex={5} xs={12} sm={12} md={12}>
                <Panel title="Description" expandable={false} fill>
                  <Row gutter={5}>
                    <Col flex={12}>
                      <Field
                        id="description"
                        component={TextField}
                        name="description"
                        placeholder="Description"
                        type="text"
                        rows={1}
                        maxRows={6}
                      />
                    </Col>
                  </Row>
                </Panel>
              </Col>

              <Col flex={12}>
                <Panel
                  title="Networking"
                  expandable={false}
                  noPadding
                >
                  <Row gutter={5} paddingLeft="16px">
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
                  <Panel title="Service Mappings" noPadding noShadow count={values.properties.port_mappings.length}>
                    <FieldArray
                      name="properties.port_mappings"
                      component={PortMappingsForm}
                      networkType={values.properties.network}
                      portMappingFormValues={values.properties.port_mappings}
                      change={change}
                    />
                  </Panel>}
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
                    provider={selectedProvider}
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
                  <Row gutter={5} alignItems="baseline">
                    <Col flex={12}>
                      <Field
                        component={TextField}
                        name="properties.constraints"
                        label="Constraints"
                        type="text"
                        helpText="Comma delimited set of constraints e.g. <field name>:<LIKE | UNLIKE | UNIQUE | CLUSTER | GROUP_BY | MAX_PER>:<optional param>, ..."
                      />
                    </Col>
                    <Col flex={6} xs={12}>
                      <Field
                        component={TextField}
                        name="properties.user"
                        label="User"
                        type="text"
                        helpText="unix formatted username"
                      />
                    </Col>
                    <Col flex={6} xs={12}>
                      <Field
                        label="Role"
                        addLabel="Add Role"
                        component={Chips}
                        name="properties.accepted_resource_roles"
                        ignorePrefixValidation
                      />
                    </Col>
                  </Row>
                </Panel>
              </Col>
            </Row>
          </React.Fragment>}

      {!inlineMode &&
      <FullPageFooter>
        <Button
          flat
          iconChildren="arrow_back"
          disabled={containerPending || props.submitting}
          component={Link}
          to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`}
        >
          Containers
        </Button>

        <Button
          raised
          iconChildren="save"
          type="submit"
          disabled={isSubmitDisabled || !selectedProvider.id}
          primary
        >
          {editMode ? 'Update' : 'Create'}
        </Button>
      </FullPageFooter>}
    </Form>
  );
};

ContainerForm.propTypes = {
  values: PropTypes.object.isRequired,
  containerPending: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  providersData: PropTypes.array.isRequired,
  container: PropTypes.object.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
  inlineMode: PropTypes.bool,
  apiEndpoints: PropTypes.array,
  apiEndpointsPending: PropTypes.bool,
  showAPIEndpointWizardModal: PropTypes.func.isRequired,
  secretsData: PropTypes.array,
  change: PropTypes.func.isRequired,
  providerType: PropTypes.string,
  onSelectedProvider: PropTypes.func,
};

ContainerForm.defaultProps = {
  title: null,
  submitLabel: null,
  cancelLabel: 'Cancel',
  editMode: false,
  inlineMode: false,
  providerType: null,
  onSelectedProvider: () => { },
  secretsData: [],
  apiEndpoints: [],
  apiEndpointsPending: false,
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
