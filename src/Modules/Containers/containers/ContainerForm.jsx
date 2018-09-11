import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Field } from 'react-final-form';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import { Checkbox, SelectField, TextField } from 'components/ReduxFormFields';
import { UnixVariablesForm, LabelsForm } from 'Modules/Variables';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import { Panel } from 'components/Panels';
import { Chips } from 'components/Lists';
import { fixInputNumber, fixInputDecimal, formatName } from 'util/forms';
import { SecretsPanelForm } from 'Modules/Secrets';
import PortMappingsForm from '../components/PortMappingsForm';
import HealthChecksForm from '../components/HealthChecksForm';
import VolumesForm from '../components/VolumesForm';
import SelectedProvider from './SelectedProvider';
import actions from '../actions';
import { selectContainer, selectProvider } from '../selectors';

const ContainerForm = ({
  form,
  formName,
  submitting,
  match,
  values,
  loading,
  editMode,
  inlineMode,
  selectedProvider,
}) => {
  const isSubmitDisabled = loading || submitting;
  // Allow access to form values when a formName is applies
  const formValues = formName
    ? get(values, formName)
    : values;

  const otherExpanded = Boolean(formValues.properties && (formValues.properties.constraints.length || formValues.properties.user || formValues.properties.accepted_resource_roles.length));

  return (
    <React.Fragment>
      {!selectedProvider.isSelected &&
        <Row gutter={5} hide={selectedProvider.isSelected}>
          <Col flex={12}>
            <Panel title="Select a Provider" expandable={false}>
              <Row gutter={5}>
                <Col flex={12}>
                  <SelectedProvider
                    label="CaaS Provider"
                    form={form}
                    name={`${formName}.properties.provider.id`}
                  />
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>}

      {selectedProvider.isSelected &&
        <Row gutter={5}>
          <Col flex={7} xs={12} sm={12} md={12}>
            <Panel title="General" expandable={false} fill>
              <Row gutter={5}>
                {!editMode &&
                  <Col flex={6} xs={12}>
                    <Field
                      id="container-name"
                      component={TextField}
                      name={`${formName}.name`}
                      label="Container Name"
                      type="text"
                      required
                      parse={formatName}
                      helpText="the name of the container"
                    />
                  </Col>}
                <Col flex={2} xs={12}>
                  <Field
                    component={TextField}
                    name={`${formName}.properties.num_instances`}
                    min={0}
                    max={999}
                    step={1}
                    label="Instances"
                    type="number"
                    parse={fixInputNumber}
                    format={fixInputNumber}
                    helpText="0 = suspended"
                  />
                </Col>
                <Col flex={2} xs={12}>
                  <Field
                    component={TextField}
                    name={`${formName}.properties.cpus`}
                    min={0.1}
                    max={10.0}
                    step="any"
                    label="CPU"
                    type="number"
                    required
                    parse={fixInputDecimal}
                    format={fixInputDecimal}
                  />
                </Col>
                <Col flex={2} xs={12}>
                  <Field
                    component={TextField}
                    name={`${formName}.properties.memory`}
                    min={32}
                    step={1}
                    label="Memory"
                    type="number"
                    required
                    parse={fixInputNumber}
                    format={fixInputNumber}
                  />
                </Col>
                <Col flex={10}>
                  <Field
                    component={TextField}
                    name={`${formName}.properties.image`}
                    label="Image"
                    type="text"
                    required
                    helpText="[registry-url]/[namespace]/[image]:[tag]"
                  // rows={1}
                  // maxRows={4}
                  />
                </Col>

                <Col flex={2} xs={12}>
                  <Field
                    id="force_pull"
                    component={Checkbox}
                    name={`${formName}.properties.force_pull`}
                    checked={formValues.properties.force_pull}
                    label="Force Pull"
                  />
                </Col>

                <Col flex={12}>
                  <Field
                    id="select-network"
                    component={SelectField}
                    name={`${formName}.properties.network`}
                    menuItems={selectedProvider.networks}
                    disabled={!selectedProvider.networks.length}
                    label={!selectedProvider.networks.length ? 'No Configured Network Types' : 'Network Type'}
                    itemLabel="name"
                    itemValue="name"
                    required
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
                    name={`${formName}.description`}
                    placeholder="Description"
                    type="text"
                    rows={1}
                    maxRows={12}
                  />
                </Col>
              </Row>
            </Panel>
          </Col>

          <Col flex={12}>
            <Panel
              title="Service Port Mappings"
              expandable={false}
              noPadding
            >
              <PortMappingsForm
                fieldName={`${formName}properties.port_mappings`}
                form={form}
                formValues={values}
                networkType={formValues.properties.network}
              />
            </Panel>
          </Col>

          <Col flex={12}>
            <Panel
              title="Environment Variables"
              defaultExpanded={formValues.properties.env.length > 0}
              noPadding
              count={formValues.properties.env.length}
            >
              <UnixVariablesForm fieldName={`${formName}.properties.env`} formValues={values} />
            </Panel>
          </Col>

          <Col flex={12}>
            <Panel
              title="Labels"
              defaultExpanded={formValues.properties.labels.length > 0}
              noPadding
              count={formValues.properties.labels.length}
            >
              <LabelsForm fieldName={`${formName}.properties.labels`} formValues={values} />
            </Panel>
          </Col>

          {!inlineMode &&
            <Col flex={12}>
              <Panel
                title="Volumes"
                noPadding
                defaultExpanded={formValues.properties.volumes.length > 0}
                count={formValues.properties.volumes.length}
              >
                <VolumesForm
                  fieldName={`${formName}.properties.volumes`}
                  providerId={selectedProvider.provider.id}
                />
              </Panel>
            </Col>}

          {selectedProvider.supportsSecrets && !inlineMode &&
            <Col flex={12}>
              <Panel
                title="Secrets"
                noPadding
                defaultExpanded={formValues.properties.secrets.length > 0}
                count={formValues.properties.secrets.length}
              >
                <SecretsPanelForm
                  fieldName={`${formName}.properties.secrets`}
                  formValues={values}
                  provider={selectedProvider.provider}
                  type="container"
                  form={form}
                />
              </Panel>
            </Col>}

          {/* TODO: Implement for Kubernetes/Docker when api is ready */}
          {selectedProvider.supportsHealth &&
            <Col flex={12}>
              <Panel
                title="Health Checks"
                noPadding
                defaultExpanded={formValues.properties.health_checks.length > 0}
                count={formValues.properties.health_checks.length}
              >
                <HealthChecksForm
                  fieldName={`${formName}.properties.health_checks`}
                  formValues={values}
                />
              </Panel>
            </Col>}

          <Col flex={12}>
            <Panel title="Command" defaultExpanded={!!formValues.properties.cmd}>
              <Field
                name={`${formName}.properties.cmd`}
                component={TextField}
                label="Command"
                type="text"
                helpText="e.g. /usr/bin/myscript.sh arg1 arg2..."
              />
            </Panel>
          </Col>

          <Col flex={12}>
            <Panel
              title="Other"
              defaultExpanded={otherExpanded}
            >
              <Row gutter={5} alignItems="baseline">
                <Col flex={12}>
                  <Field
                    name={`${formName}.properties.constraints`}
                    id="container--constraints"
                    label="Constraints"
                    addLabel="Add Constraint"
                    component={Chips}
                    helpText="e.g. <field name>:<LIKE | UNLIKE | UNIQUE | CLUSTER | GROUP_BY | MAX_PER>:<optional param>"
                    ignorePrefixValidation
                  />
                </Col>
                <Col flex={6} xs={12}>
                  <Field
                    component={TextField}
                    name={`${formName}.properties.user`}
                    label="User"
                    type="text"
                    helpText="unix formatted username"
                  />
                </Col>
                <Col flex={6} xs={12}>
                  <Field
                    id="container--roles"
                    label="Role"
                    addLabel="Add Role"
                    component={Chips}
                    name={`${formName}.properties.accepted_resource_roles`}
                    ignorePrefixValidation
                  />
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>}

      {!inlineMode &&
        <FullPageFooter>
          <Button
            flat
            iconChildren="arrow_back"
            disabled={isSubmitDisabled}
            component={Link}
            to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`}
          >
            Containers
          </Button>

          <Button
            raised
            iconChildren="save"
            type="submit"
            disabled={isSubmitDisabled || !selectedProvider.isSelected}
            primary
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </FullPageFooter>}
    </React.Fragment>
  );
};

ContainerForm.propTypes = {
  form: PropTypes.object.isRequired,
  formName: PropTypes.string,
  values: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  submitting: PropTypes.bool,
  editMode: PropTypes.bool,
  inlineMode: PropTypes.bool,
  selectedProvider: PropTypes.object.isRequired,
};

ContainerForm.defaultProps = {
  editMode: false,
  submitting: false,
  inlineMode: false,
  formName: '',
};

const mapStateToProps = state => ({
  container: selectContainer(state),
  selectedProvider: selectProvider(state),
});

export default compose(
  withRouter,
  connect(mapStateToProps, actions),
)(ContainerForm);
