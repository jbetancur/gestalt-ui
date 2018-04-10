import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { withDatafeed } from 'Modules/MetaResource';
import { Form } from 'react-final-form';
import { withSecretsPicker } from 'Modules/Secrets';
import DataFeedForm from './/DataFeedForm';
import validate from './validations';

const initialValues = {
  name: '',
  properties: {
    kind: 'Kafka',
    data: {
      format: 'JSON',
      endpoint: '//KafkaService/Queue',
      data: '{ "some": "json" }',
      classification: ''
    }
  }
};

class DataFeedCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    datafeedActions: PropTypes.object.isRequired,
    datafeedPending: PropTypes.bool.isRequired,
    secrets: PropTypes.array.isRequired,
  };

  onSubmit = (values) => {
    const { match, history, datafeedActions } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/datafeeds/${response.id}`);

    datafeedActions.createDatafeed({ fqon: match.params.fqon, entityId: match.params.environmentId, entityKey: 'environments', payload: values, onSuccess });
  };


  render() {
    const { datafeedPending, secrets } = this.props;

    return (
      <Row justifyContent="center">
        <Col flex={8} xs={12} sm={12} md={10}>
          <Form
            onSubmit={this.onSubmit}
            initialValues={initialValues}
            render={DataFeedForm}
            validate={validate}
            loading={datafeedPending}
            secrets={secrets}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withSecretsPicker,
  withDatafeed,
  withRouter,
)(DataFeedCreate);
