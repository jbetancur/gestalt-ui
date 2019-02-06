import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get, orderBy } from 'lodash';
import { SelectField } from 'components/ReduxFormFields';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { Panel } from 'components/Panels';
import { UnixVariablesForm } from 'Modules/Variables';
import { SecretsPanelForm } from 'Modules/Secrets';
import LambdaSection from '../components/LambaSection';
import LambdaFunctionSection from '../components/LambdaFunctionSection';
import LambdaPeriodicSection from '../components/LambdaPeriodicSection';
import LambdaAdvancedSection from '../components/LambdaAdvancedSection';
import LambdaSourceSection from '../components/LambdaSourceSection';
import providerModel from '../../Providers/models/provider';
import runTimes from '../lists/runTimes';
import iconMap from '../../Providers/config/iconMap';

class LambdaForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    editMode: PropTypes.bool,
    lambda: PropTypes.object,
    providers: PropTypes.array.isRequired,
    executors: PropTypes.array.isRequired,
    secrets: PropTypes.array.isRequired,
    onSaveInlineCode: PropTypes.func,
    lambdaStateActions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    editMode: false,
    lambda: {},
    onSaveInlineCode: null,
  };

  // shouldComponentUpdate(nextProps) {
  //   return !isEqual(this.props.values, nextProps.values);
  // }

  handleRuntimeProps = (id) => {
    const { editMode, executors, form, lambdaStateActions } = this.props;
    const selectedExecutor = executors.find(e => e.id === id);
    const selectedRuntime = {
      codeOptions: [{ displayName: 'Package', value: 'package' }],
      ...runTimes.find(runtime => runtime.value === get(selectedExecutor, 'properties.config.env.public.RUNTIME')),
    };

    form.batch(() => {
      // always set back to package if the runtime is changed
      if (selectedRuntime.codeOptions.some(opt => opt.value !== 'code')) {
        form.change('properties.code_type', 'package');
      }

      if (!editMode && selectedRuntime.starterCode && selectedRuntime.defaultHandler) {
        form.change('properties.code', selectedRuntime.starterCode);
        form.change('properties.handler', selectedRuntime.defaultHandler);
      }

      // set memory to the default recommended values
      if (!editMode && selectedRuntime.defaultMem) {
        form.change('properties.memory', selectedRuntime.defaultMem);
      }

      if (!editMode) {
        lambdaStateActions.setRunTime(selectedRuntime);
      }

      form.change('properties.runtime', id);
    });
  }

  generateMenuItems() {
    const { executors } = this.props;
    return orderBy(executors, 'name').map(item => ({
      label: item.name,
      value: item.id,
      leftIcon: iconMap(get(item, 'properties.config.env.public.RUNTIME')),
    }));
  }

  render() {
    const { form, errors, values, lambda, providers, secrets, editMode, onSaveInlineCode } = this.props;
    const safeErrors = {
      ...errors,
      properties: {
        ...errors.properties,
      }
    };

    // TODO: refactor to redux
    const selectedProvider = editMode
      ? get(lambda, 'properties.provider')
      : providers.find(p => p.id === values.properties.provider.id) || providerModel.get();

    if (!(values.properties.provider.id && values.properties.runtime)) {
      return (
        <Row gutter={5}>
          <Col flex={12}>
            <Panel title="Select a Lambda Provider & Runtime" expandable={false}>
              <Row gutter={5}>
                <Col flex={12}>
                  <Field
                    id="lambda-provider"
                    component={SelectField}
                    name="properties.provider.id"
                    required
                    label="Lambda Provider"
                    itemLabel="name"
                    itemValue="id"
                    menuItems={providers}
                    async
                  />
                </Col>

                <Col flex={12}>
                  <Field
                    id="select-runtime"
                    component={SelectField}
                    name="properties.runtime"
                    menuItems={this.generateMenuItems()}
                    listHeightRestricted={false}
                    required
                    label="Runtime"
                    async
                    onChange={this.handleRuntimeProps}
                  />
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>
      );
    }

    return (
      <React.Fragment>
        <LambdaSection providers={providers} editMode={editMode} />

        <Row gutter={5}>
          <Col flex={7} xs={12} sm={12} md={12}>
            <LambdaFunctionSection
              codeType={values.properties.code_type}
              packageCompressed={values.properties.compressed}
              editMode={editMode}
            />
          </Col>

          <Col flex={5} xs={12} sm={12} md={12}>
            <LambdaAdvancedSection formValues={values} form={form} />
          </Col>

          {values.properties.code_type === 'code' &&
            <Col flex={12}>
              <LambdaSourceSection onSave={onSaveInlineCode} formValues={values} />
            </Col>}

          <Col flex={12}>
            <Panel
              title="Environment Variables"
              noPadding
              count={values.properties.env.length}
              defaultExpanded={editMode && values.properties.env.length > 0}
              error={safeErrors.properties.env && errors.properties.env.length > 0}
            >
              <UnixVariablesForm fieldName="properties.env" />
            </Panel>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col flex={12}>
            <Panel
              title="Secrets"
              noPadding
              defaultExpanded={editMode && values.properties.secrets.length > 0}
              count={values.properties.secrets.length}
              error={safeErrors.properties.secrets && errors.properties.secrets.length > 0}
            >
              <SecretsPanelForm
                fieldName="properties.secrets"
                secretsDropdown={secrets}
                provider={selectedProvider}
                type="lambda"
                form={form}
              />
            </Panel>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col flex={12}>
            <LambdaPeriodicSection
              editMode={editMode}
              expanded={!!values.properties.periodic_info.schedule}
              error={!!safeErrors.properties.periodic_info}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default LambdaForm;
