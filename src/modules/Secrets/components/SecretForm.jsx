import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import SelectField from 'components/SelectField';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import Fieldset from 'components/Fieldset';
import DetailsPane from 'components/DetailsPane';
import { VariablesForm } from 'modules/Variables';
import { isSecretKeyValidation, secretKeyValidationPattern } from 'util/validations';
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
  } = props;

  const getProviders = () => props.providersByType.filter(item => item.resource_type === 'Gestalt::Configuration::Provider::CaaS::Kubernetes');

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
          <CardTitle
            title={title}
          />
          <CardText>
            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  id="select-provider"
                  component={SelectField}
                  name="properties.provider.id"
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  menuItems={getProviders()}
                  async
                  onFocus={() => props.fetchProvidersByType(props.match.params.fqon, match.params.environmentId, 'environments', 'CaaS')}
                  disabled={secret.id}
                  required
                />
              </Col>

              <Col flex={5} xs={12}>
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
              <Col flex={7} xs={12}>
                <Field
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  rows={1}
                />
              </Col>

              <Col flex={12}>
                <Fieldset legend="Secret Items" style={{ minHeight: '16em' }}>
                  <VariablesForm
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
                </Fieldset>
              </Col>
            </Row>
          </CardText>
          {secretPending && <LinearProgress id="secret-form" />}
          <CardActions>
            <Button
              flat
              disabled={secretPending || submitting}
              component={Link}
              to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`}
            >
              {cancelLabel}
            </Button>
            <Button
              raised
              type="submit"
              disabled={pristine || secretPending || invalid || submitting}
              primary
            >
              {submitLabel}
            </Button>
          </CardActions>
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
  fetchProvidersByType: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
};

SecretForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
};

export default SecretForm;
