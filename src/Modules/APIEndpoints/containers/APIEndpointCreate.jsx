import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import APIEndpointForm from './APIEndpointForm';
import validate from './validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateEndpointModel } from '../selectors';

class APIEndpointCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createAPIEndpoint: PropTypes.func.isRequired,
    apiEndpointPending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  };

  create = (values) => {
    const { match, history, createAPIEndpoint } = this.props;
    const payload = generatePayload(values);

    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`);
    createAPIEndpoint(match.params.fqon, match.params.apiId, payload, onSuccess);
  }

  render() {
    const { initialFormValues, apiEndpointPending } = this.props;

    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create an Endpoint" />

          {apiEndpointPending && <ActivityContainer id="apiEndpoint-form" />}

          <Form
            onSubmit={this.create}
            initialValues={initialFormValues}
            render={APIEndpointForm}
            validate={validate}
            loading={apiEndpointPending}
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  apiEndpoint: getCreateEndpointModel(state),
  initialFormValues: getCreateEndpointModel(state),
});

export default compose(
  withPickerData({ entity: 'lambdas', label: 'Lambdas', fetchOnMount: false }),
  withPickerData({ entity: 'containers', label: 'Containers', fetchOnMount: false }),
  withMetaResource,
  connect(mapStateToProps, actions),
)(APIEndpointCreate);
