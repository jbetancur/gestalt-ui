import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { withDatafeed, withPickerData } from 'Modules/MetaResource';
import { Form } from 'react-final-form';
import { generateContextEntityState } from 'util/helpers/context';
import DataFeedForm from './DataFeedForm';
import validate from './validations';

const initialValues = {
  name: null,
  properties: {
    kind: 'Kafka',
    data: {
      format: 'JSON',
      endpoint: null,
      data: null,
      classification: null,
      secret: null,
    },
  },
};

class DataFeedCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    datafeedActions: PropTypes.object.isRequired,
    datafeedPending: PropTypes.bool.isRequired,
    secretsData: PropTypes.array.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  onSubmit = (values) => {
    const { match, history, datafeedActions } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/datafeeds/${response.id}`);
    const entity = generateContextEntityState(match.params);

    datafeedActions.createDatafeed({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, payload: values, onSuccess });
  };


  render() {
    const { datafeedPending, secretsData, entitlementActions } = this.props;

    return (
      <Row justifyContent="center">
        <Col flex={8} xs={12} sm={12} md={10}>
          <Form
            title="Create Data Feed"
            onSubmit={this.onSubmit}
            initialValues={initialValues}
            render={DataFeedForm}
            validate={validate}
            loading={datafeedPending}
            secrets={secretsData}
            entitlementActions={entitlementActions}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withPickerData({ entity: 'secrets', label: 'Secrets' }),
  withDatafeed,
  withRouter,
)(DataFeedCreate);
