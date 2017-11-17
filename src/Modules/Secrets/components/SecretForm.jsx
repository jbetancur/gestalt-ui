import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field, getFormValues } from 'redux-form';
import { Card, CardTitle, CardText, LinearProgress } from 'react-md';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { Panel } from 'components/Panels';
import { VariablesForm } from 'Modules/Variables';
import { isSecretKeyValidation, secretKeyValidationPattern } from 'util/validations';
import { parseChildClass } from 'util/helpers/strings';
import { nameMaxLen } from '../validations';

const SecretForm = (props) => {
  const {
    match,
    secretPending,
    secret,
    onSubmit,
    invalid,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    values,
    reset,
  } = props;

  const getProviders = () => props.providersByType
    .filter(item => parseChildClass(item.resource_type) === 'Kubernetes' || item.properties.config.secret_support);
  const selectedProvider = Object.assign({}, props.providersByType.find(p => p.id === values.properties.provider.id));
  const isMultiPartSecret = parseChildClass(selectedProvider.resource_type) === 'Kubernetes';

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      {secret.id &&
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12}>
            <DetailsPane model={secret} />
          </Col>
        </Row>}
      <Row gutter={5} center>
        <Col component={Card} flex={10} xs={12} sm={12}>
          <CardTitle title={title} />
          <ActionsToolbar>
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
              disabled={pristine || secretPending || invalid || submitting}
              primary
            >
              {submitLabel}
            </Button>
          </ActionsToolbar>
          {secretPending && <LinearProgress id="secret-form" />}
          <CardText>
            <Row gutter={5}>
              <Col flex={6} xs={12}>
                <Field
                  id="select-provider"
                  component={SelectField}
                  name="properties.provider.id"
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  menuItems={getProviders()}
                  async
                  disabled={secret.id}
                  onChange={() => reset()}
                  required
                />
              </Col>

              <Col flex={6} xs={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  maxLength={nameMaxLen}
                  autoComplete="none"
                />
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

              {selectedProvider.id && isMultiPartSecret &&
                <Col flex={12}>
                  <Panel title="Secret Items">
                    <VariablesForm
                      allowSingleItemOnly
                      addButtonLabel="Secret Item"
                      icon="add"
                      fieldName="properties.items"
                      keyFieldName="key"
                      keyFieldValue="key"
                      hideValueField={secret.id}
                      keyFieldValidationFunction={isSecretKeyValidation}
                      keyFieldValidationMessage={`allowed format: ${secretKeyValidationPattern}`}
                      disabled={secret.id}
                    />
                  </Panel>
                </Col>}

              {selectedProvider.id && !isMultiPartSecret &&
                <Row gutter={5}>
                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="properties.items[0].key"
                      label="Seret Key"
                      type="text"
                      rows={1}
                      disabled={secret.id}
                      required
                    />
                  </Col>
                  {!secret.id &&
                    <Col flex={6} xs={12}>
                      <Field
                        component={TextField}
                        name="properties.items[0].value"
                        label="Secret Value"
                        type="text"
                        rows={1}
                        required
                      />
                    </Col>}
                </Row>}
            </Row>
          </CardText>
        </Col>
      </Row>
    </form>
  );
};

SecretForm.propTypes = {
  match: PropTypes.object.isRequired,
  secret: PropTypes.object.isRequired,
  secretPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  providersByType: PropTypes.array.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  values: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

SecretForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
};

export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(SecretForm);
