import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Form from 'components/Form';
import { Button } from 'components/Buttons';
import { Row, Col } from 'react-flexybox';
import { Panel } from 'components/Panels';
import { UnixVariablesForm } from 'Modules/Variables';
import { SecretsPanelForm } from 'Modules/Secrets';
import { FullPageFooter } from 'components/FullPage';
import LambdaSection from '../components/LambaSection';
import LambdaFunctionSection from '../components/LambdaFunctionSection';
import LambdaPeriodicSection from '../components/LambdaPeriodicSection';
import LambdaAdvancedSection from '../components/LambdaAdvancedSection';
import LambdaSourceSection from '../components/LambdaSourceSection';
import SelectProvider from '../components/SelectProvider';
import providerModel from '../../Providers/models/provider';

const LambdaForm = ({ handleSubmit, form, errors, values, match, loading, providers, executors, secrets, editMode, pristine, submitting, onSaveInlineCode }) => {
  const safeErrors = {
    ...errors,
    properties: {
      ...errors.properties,
    }
  };

  // TODO: refactor to redux
  const selectedProvider = editMode
    ? values.properties.provider
    : providers.find(p => p.id === values.properties.provider.id) || providerModel.get();

  return (
    <Form
      onSubmit={handleSubmit}
      autoComplete="off"
      disabled={loading}
    >
      {!values.properties.provider.id
        ?
          <SelectProvider providers={providers} />
        :
          <React.Fragment>
            <LambdaSection providers={providers} editMode={editMode} />

            <Row gutter={5}>
              <Col flex={7} xs={12} sm={12} md={12}>
                <LambdaFunctionSection
                  executors={executors}
                  formValues={values}
                  editMode={editMode}
                  form={form}
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
                  <UnixVariablesForm fieldName="properties.env" formValues={values} />
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
                    formValues={values}
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
                  formValues={values}
                  errors={safeErrors}
                />
              </Col>
            </Row>
          </React.Fragment>}

      <FullPageFooter>
        <Button
          flat
          iconChildren="arrow_back"
          disabled={loading || submitting}
          component={Link}
          to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/lambdas`}
        >
          Lambdas
        </Button>
        <Button
          raised
          iconChildren="save"
          type="submit"
          disabled={pristine || submitting}
          primary
        >
          {editMode ? 'Update' : 'Create'}
        </Button>
      </FullPageFooter>
    </Form>
  );
};

LambdaForm.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  // lambda: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
  providers: PropTypes.array.isRequired,
  executors: PropTypes.array.isRequired,
  secrets: PropTypes.array.isRequired,
  onSaveInlineCode: PropTypes.func,
};

LambdaForm.defaultProps = {
  editMode: false,
  onSaveInlineCode: null,
};

export default withRouter(LambdaForm);
