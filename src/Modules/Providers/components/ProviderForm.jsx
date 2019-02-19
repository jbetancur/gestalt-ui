import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { isEqual } from 'lodash';
import { Field, FormSpy } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { ContainerForm } from 'Modules/Containers';
import { UnixVariablesForm } from 'Modules/Variables';
import ActionsToolbar from 'components/ActionsToolbar';
import { Chips } from 'components/Lists';
import { formatName } from 'util/forms';
import LinkedProviders from './LinkedProviders';
import EnvironmentTypes from './EnvironmentTypes';
import DCOSEESection from './DCOSEESection';
import DataEditor from './DataEditor';
import DCOSSection from './DCOSSection';
import ECSConfig from './ECSConfig';
import Networks from './Networks';

const httpProtocols = [{ name: 'HTTPS', value: 'https' }, { name: 'HTTP', value: 'http' }];

class ProviderForm extends PureComponent {
  static propTypes = {
    provider: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    providerPending: PropTypes.bool.isRequired,
    providers: PropTypes.array.isRequired,
    editMode: PropTypes.bool,
    selectedProviderType: PropTypes.object,
    envSchema: PropTypes.object,
    envSchemaPending: PropTypes.bool,
    hasContainer: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    editMode: false,
    selectedProviderType: {},
    envSchema: {},
    envSchemaPending: false,
  };

  componentDidMount() {
    const { editMode } = this.props;

    if (!editMode) {
      this.initEnvSchema();
    }
  }

  initEnvSchema() {
    const { form, envSchema } = this.props;
    form.change('properties.config.env', envSchema);
  }

  render() {
    const {
      form,
      provider,
      editMode,
      selectedProviderType,
      providerPending,
      providers,
      container,
      hasContainer,
      ...rest
    } = this.props;

    const linkedProviders = providers.filter(p => p.id !== provider.id);

    return (
      <React.Fragment>
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
        </Row>


        <Row gutter={5}>
          {selectedProviderType.DCOSConfig &&
            <Col flex={12}>
              <Panel title="Configuration" expandable={false}>
                <DCOSSection />

                <Panel title="Enterprise Configuration" expandable={false} noShadow noPadding>
                  <DCOSEESection />
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
        </Row>

        {selectedProviderType.allowEnvVariables &&
          <Row gutter={5}>
            <Col flex={12}>
              <Panel title="Public Variables" noPadding>
                <UnixVariablesForm fieldName="properties.config.env.public" />
              </Panel>
            </Col>
            <Col flex={12}>
              <Panel title="Private Variables" noPadding>
                <UnixVariablesForm fieldName="properties.config.env.private" />
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

        <Row gutter={5}>
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
        </Row>

        {hasContainer && (
          <FormSpy subscription={{ values: true }}>
            {({ values }) => (
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Container Specification" defaultExpanded={hasContainer}>
                    {editMode &&
                      <ActionsToolbar
                        title={values.properties.services[0].container_spec.name}
                        subtitle={container.properties.provider.name}
                      />
                    }
                    <ContainerForm
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
              </Row>
            )}
          </FormSpy>
        )}
      </React.Fragment>
    );
  }
}

export default ProviderForm;
