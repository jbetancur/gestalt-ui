import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field, FieldArray, getFormValues } from 'redux-form';
import { Title } from 'components/Typography';
import { metaModels } from 'Modules/MetaResource';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { Panel } from 'components/Panels';
import { ActivityContainer } from 'components/ProgressIndicators';
import Form from 'components/Form';
import { getLastFromSplit } from 'util/helpers/strings';
import SecretItemsForm from '../components/SecretItemsForm';

const SecretForm = (props) => {
  const {
    match,
    secretPending,
    secret,
    onSubmit,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    values,
    reset,
  } = props;

  const filteredProviderTypes = () => props.providersByType
    .filter(provider => getLastFromSplit(provider.resource_type) === 'Kubernetes' || metaModels.provider.get(provider).properties.config.secret_support);
  const providerTypes = filteredProviderTypes().length > 0 ? filteredProviderTypes() : props.providersByType;
  const selectedProvider = Object.assign({}, props.providersByType.find(p => p.id === values.properties.provider.id));
  const isMultiPartSecret = getLastFromSplit(selectedProvider.resource_type) === 'Kubernetes';

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off" disabled={secretPending}>
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <Title>{title}</Title>
          <ActionsToolbar>
            <Row>
              <Col flex={12}>
                <Button
                  flat
                  iconChildren="arrow_back"
                  disabled={secretPending || submitting}
                  component={Link}
                  to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/secrets`}
                >
                  {cancelLabel}
                </Button>
                <Button
                  raised
                  iconChildren="save"
                  type="submit"
                  disabled={pristine || secretPending || submitting}
                  primary
                >
                  {submitLabel}
                </Button>
                {/* {secret.id &&
                <Button
                  key="secret--entitlements"
                  flat
                  iconChildren="security"
                  onClick={() => props.entitlementActions.showEntitlementsModal(props.title, props.match.params.fqon, secret.id, 'secrets', 'Secret')}
                >
                  Secret Entitlements
                </Button>} */}
              </Col>
            </Row>
          </ActionsToolbar>

          {secretPending && <ActivityContainer id="secret-form-loading" />}

          <Row gutter={5}>
            {secret.id &&
              <Col flex={12}>
                <Panel title="Resource Details">
                  <DetailsPane model={secret} />
                </Panel>
              </Col>}
            <Col flex={12}>
              <Panel title="General" expandable={false}>
                <Row gutter={5}>
                  <Col flex={6} xs={12}>
                    <Field
                      id="select-provider"
                      component={SelectField}
                      name="properties.provider.id"
                      label="Provider"
                      itemLabel="name"
                      itemValue="id"
                      menuItems={providerTypes}
                      disabled={secret.id}
                      onChange={reset}
                      required
                      async
                    />
                  </Col>

                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="name"
                      label="Name"
                      type="text"
                      required
                      autoComplete="none"
                    />
                  </Col>
                </Row>
              </Panel>
            </Col>

            <Col flex={12}>
              <Panel title="Description" defaultExpanded={!!secret.description}>
                <Field
                  component={TextField}
                  name="description"
                  placeholder="Description"
                  type="text"
                  rows={1}
                />
              </Panel>
            </Col>

            {selectedProvider.id &&
              <Col flex={12}>
                <Panel title="Secret Items" noPadding>
                  <FieldArray
                    component={SecretItemsForm}
                    name="properties.items"
                    disabled={secret.id}
                    multiPart={isMultiPartSecret}
                  />
                </Panel>
              </Col>}
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

SecretForm.propTypes = {
  match: PropTypes.object.isRequired,
  secret: PropTypes.object.isRequired,
  secretPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  providersByType: PropTypes.array.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  values: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  // entitlementActions: PropTypes.object,
};

SecretForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  // entitlementActions: {},
};

export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(SecretForm);
