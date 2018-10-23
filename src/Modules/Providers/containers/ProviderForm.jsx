import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import Form from 'components/Form';
import { Panel } from 'components/Panels';
import { ContainerForm } from 'Modules/Containers';
import { UnixVariablesForm } from 'Modules/Variables';
import ActionsToolbar from 'components/ActionsToolbar';
import { Chips } from 'components/Lists';
import { formatName } from 'util/forms';
import LinkedProviders from '../components/LinkedProviders';
import EnvironmentTypes from '../components/EnvironmentTypes';
import DCOSEESection from '../components/DCOSEESection';
import DataEditor from '../components/DataEditor';
import DCOSSection from '../components/DCOSSection';
import ECSConfig from '../components/ECSConfig';
import Networks from '../components/Networks';

const httpProtocols = [{ name: 'HTTPS', value: 'https' }, { name: 'HTTP', value: 'http' }];
const stripProviderTypeKeys = ['supportsURL', 'supportsCMD', 'supportsPortType', 'allowLinkedProviders', 'allowEnvVariables', 'DCOSConfig', 'dataConfig', 'allowContainer', 'inputType', 'allowStorageClasses', 'subTypes'];

class ProviderForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    providerPending: PropTypes.bool.isRequired,
    providers: PropTypes.array.isRequired,
    onRedeploy: PropTypes.func,
    editMode: PropTypes.bool,
    goBack: PropTypes.func.isRequired,
    selectedProviderType: PropTypes.object,
    onSelecedProviderType: PropTypes.func,
    envSchemaPending: PropTypes.bool,
  };

  static defaultProps = {
    onRedeploy: null,
    editMode: false,
    selectedProviderType: {},
    onSelecedProviderType: () => { },
    envSchemaPending: false,
  };

  handleProviderChange = (value) => {
    const { form, resourceTypes, setSelectedProviderType } = this.props;
    const providerType = resourceTypes.find(type => type.name === value);

    form.change('resource_type', value);

    if (providerType.id) {
      setSelectedProviderType({ fqon: 'root', providerType });
    }
  };

  handleRedeploy = () => {
    const { onRedeploy } = this.props;

    if (onRedeploy) {
      onRedeploy();
    }
  }

  render() {
    const {
      form,
      errors,
      handleSubmit,
      submitting,
      invalid,
      values,
      provider,
      editMode,
      selectedProviderType,
      providerPending,
      envSchemaPending,
      goBack,
      resourceTypes,
      providers,
      container,
      ...rest
    } = this.props;

    const submitDisabled = envSchemaPending || providerPending || submitting;
    const linkedProviders = providers.filter(p => p.id !== provider.id);

    return (
      <Form onSubmit={handleSubmit} disabled={providerPending} autoComplete="off">
        {!editMode && !selectedProviderType.name &&
          <Row gutter={5}>
            {/* only allow the provider type to be selected once - this prevents redux-form errors */}
            <Col flex={12}>
              <Panel title="Select a Provider Type" expandable={false}>
                <Field
                  id="select-provider-type"
                  component={SelectField}
                  name="resource_type"
                  menuItems={resourceTypes}
                  itemLabel="displayName"
                  itemValue="name"
                  label="Provider Type"
                  onChange={this.handleProviderChange}
                  disabled={editMode}
                  required
                  deleteKeys={stripProviderTypeKeys}
                  async
                />
              </Panel>
            </Col>
          </Row>}

        {selectedProviderType.name &&
          <Row gutter={5}>
            {!editMode &&
              <Col flex={7} xs={12} sm={12} md={12}>
                <Panel title="Name" expandable={false} fill>
                  <Row gutter={5}>
                    <Col flex={12}>
                      <Field
                        component={TextField}
                        name="name"
                        label="Provider Name"
                        type="text"
                        required
                        parse={formatName}
                        helpText="alphanumeric and dashes are allowed"
                      />
                    </Col>
                  </Row>
                </Panel>
              </Col>}

            <Col flex>
              <Panel title="Description" expandable={false} fill>
                <Row gutter={5}>
                  <Col flex>
                    <Field
                      id="provider-description"
                      component={TextField}
                      name="description"
                      placeholder="Description"
                      rows={1}
                      maxRows={6}
                    />
                  </Col>
                </Row>
              </Panel>
            </Col>
          </Row>}

        {selectedProviderType.name &&
          <Row gutter={5}>
            {selectedProviderType.DCOSConfig &&
              <Col flex={12}>
                <Panel title="Configuration" expandable={false}>
                  <DCOSSection
                    authScheme={values.properties.config.auth && values.properties.config.auth.scheme}
                    values={values}
                    {...rest}
                  />

                  <Panel title="Enterprise Configuration" expandable={false} noShadow noPadding>
                    <DCOSEESection values={values} />
                  </Panel>
                </Panel>
              </Col>}

            {selectedProviderType.ecsConfig &&
            <Col flex={12}>
              <Panel title="Configuration" expandable={false}>
                <ECSConfig
                  subTypes={selectedProviderType.subTypes}
                  editMode={editMode}
                />
              </Panel>
            </Col>}

            {selectedProviderType.dataConfig &&
              <Col flex={12}>
                <DataEditor
                  form={form}
                  editMode={editMode}
                  title={`${selectedProviderType.displayName} Configuration`}
                  editorMode={selectedProviderType.inputType}
                  subTypes={selectedProviderType.subTypes}
                />
              </Col>}

            {selectedProviderType.networksConfig &&
              <Col flex={12}>
                <Panel title="Networks" expandable={false} noPadding>
                  <Networks fieldName="properties.config.networks" />
                </Panel>
              </Col>}

            {selectedProviderType.allowStorageClasses &&
              <Col flex={12}>
                <Panel title="Storage Classes" expandable={false}>
                  <Field
                    id="provider--storageclasses"
                    label="Storage Class"
                    addLabel="Add Class"
                    component={Chips}
                    name="properties.config.storage_classes"
                    ignorePrefixValidation
                  />
                </Panel>
              </Col>}

            {selectedProviderType.allowEnvVariables &&
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel
                    title="Public Variables"
                    noPadding
                    pending={envSchemaPending}
                  >
                    <UnixVariablesForm
                      fieldName="properties.config.env.public"
                      formValues={values}
                    />
                  </Panel>
                </Col>
                <Col flex={12}>
                  <Panel title="Private Variables" noPadding pending={envSchemaPending}>
                    <UnixVariablesForm
                      fieldName="properties.config.env.private"
                      formValues={values}
                    />
                  </Panel>
                </Col>
              </Row>}

            {selectedProviderType.allowLinkedProviders &&
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Linked Providers" noPadding>
                    <LinkedProviders
                      fieldName="properties.linked_providers"
                      providers={linkedProviders}
                    />
                  </Panel>
                </Col>
              </Row>}

            <Col flex={6} xs={12} sm={12}>
              <Panel title="Allowed Environments" fill expandable={false}>
                <EnvironmentTypes />
              </Panel>
            </Col>

            <Col flex={6} xs={12} sm={12}>
              <Panel title="Advanced" fill expandable={false}>
                <Row gutter={5}>
                  <Col flex={12}>
                    <Field
                      id="select-external-protocol"
                      component={SelectField}
                      name="properties.config.external_protocol"
                      menuItems={httpProtocols}
                      itemLabel="name"
                      itemValue="value"
                      label="External Protocol"
                      helpText="The protocol used to reach any externally exposed endpoints"
                    />
                  </Col>
                </Row>
              </Panel>
            </Col>
          </Row>}

        {selectedProviderType.allowContainer &&
          <Row gutter={5}>
            <Col flex={12}>
              <Panel title="Container Specification" defaultExpanded={selectedProviderType.allowContainer}>
                {editMode &&
                <ActionsToolbar
                  title={values.properties.services[0].container_spec.name}
                  subtitle={container.properties.provider.name}
                />
                }
                <ContainerForm
                  loading={providerPending}
                  values={values}
                  form={form}
                  inlineMode
                  editMode={editMode}
                  formName="properties.services[0].container_spec"
                  providers={providers.filter(p => p.resource_type.includes('::CaaS::'))}
                  {...rest}
                />
              </Panel>
            </Col>
          </Row>}

        <FullPageFooter>
          <Button
            flat
            iconChildren="arrow_back"
            disabled={providerPending || submitting}
            onClick={goBack}
          >
            Providers
          </Button>
          {selectedProviderType.name &&
            <Button
              raised
              iconChildren="save"
              type="submit"
              disabled={submitDisabled}
              primary
            >
              {editMode ? 'Update' : 'Create'}
            </Button>}
          {editMode && selectedProviderType.allowContainer &&
            <Button
              key="provider-container-redeploy"
              raised
              iconChildren="refresh"
              type="submit"
              onClick={this.handleRedeploy}
              disabled={submitDisabled}
              primary
            >
              Redeploy Container
            </Button>}
        </FullPageFooter>
      </Form>
    );
  }
}

export default ProviderForm;
