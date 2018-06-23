import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Col, Row } from 'react-flexybox';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import { withSecret, withPickerData } from 'Modules/MetaResource';
import { generateContextEntityState } from 'util/helpers/context';
import SecretForm from './SecretForm';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateSecretModel } from '../selectors';

class SecretCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    secretActions: PropTypes.object.isRequired,
    secretPending: PropTypes.bool.isRequired,
    providersData: PropTypes.array.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  };

  create = (values) => {
    const { match, history, secretActions } = this.props;
    const payload = generatePayload(values);
    const entity = generateContextEntityState(match.params);
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/secrets/${response.id}`);

    secretActions.createSecret({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, payload, onSuccess });
  }

  render() {
    const { providersData, secretPending, initialFormValues } = this.props;

    return (
      <Row center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create a Secret" />

          {secretPending && <ActivityContainer id="secret-create-loading" />}

          <Form
            onSubmit={this.create}
            mutators={{ ...arrayMutators }}
            render={SecretForm}
            providers={providersData}
            loading={secretPending}
            initialValues={initialFormValues}
            validate={validate}
          />
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    initialFormValues: getCreateSecretModel(state),
  };
}

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withSecret,
  connect(mapStateToProps, actions),
)(SecretCreate);
