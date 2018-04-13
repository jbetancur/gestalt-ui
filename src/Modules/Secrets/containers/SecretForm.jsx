import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field, FieldArray, getFormValues } from 'redux-form';
import { metaModels } from 'Modules/MetaResource';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { FullPageFooter } from 'components/FullPage';
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
    editMode,
  } = props;

  const filteredprovidersData = () => props.providersData
    .filter(provider => getLastFromSplit(provider.resource_type) === 'Kubernetes' || metaModels.provider.get(provider).properties.config.secret_support);
  const providersData = filteredprovidersData().length > 0 ? filteredprovidersData() : props.providersData;
  const selectedProvider = Object.assign({}, props.providersData.find(p => p.id === values.properties.provider.id));
  const isMultiPartSecret = getLastFromSplit(selectedProvider.resource_type) === 'Kubernetes';

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off" disabled={secretPending}>
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={title}
            showActions={editMode}
            actions={[
              <Button
                key="secret--entitlements"
                flat
                iconChildren="security"
                onClick={() => props.entitlementActions.showEntitlementsModal(props.title, props.match.params.fqon, secret.id, 'secrets', 'Secret')}
              >
                Entitlements
              </Button>]
            }
          />

          {secretPending && <ActivityContainer id="secret-form-loading" />}

          <Row gutter={5}>
            {editMode &&
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
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
                      menuItems={providersData}
                      disabled={editMode}
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

                  <Col flex={12}>
                    <Field
                      id="description"
                      component={TextField}
                      name="description"
                      label="Description"
                      type="text"
                      rows={1}
                    />
                  </Col>
                </Row>
              </Panel>
            </Col>

            {selectedProvider.id &&
              <Col flex={12}>
                <Panel title="Secret Items" noPadding>
                  <FieldArray
                    component={SecretItemsForm}
                    name="properties.items"
                    disabled={editMode}
                    multiPart={isMultiPartSecret}
                  />
                </Panel>
              </Col>}
          </Row>
        </Col>
      </Row>
      <FullPageFooter>
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
      </FullPageFooter>
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
  providersData: PropTypes.array.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  values: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  entitlementActions: PropTypes.object,
};

SecretForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
  entitlementActions: {},
};

export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(SecretForm);
