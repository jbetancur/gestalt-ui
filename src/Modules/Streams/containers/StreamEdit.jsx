import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { withStreamSpec, withPickerData, withProviderActions } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { Form } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import streamspecForm from './StreamForm';
import validate from '../validations';
import { getStreamSpec } from '../selectors';
import { generatePatches } from '../payloadTransformer';

class StreamSpecEdit extends Component {
  static propTypes = {
    streamSpecActions: PropTypes.object.isRequired,
    streamSpec: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    streamSpecPending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    lambdasData: PropTypes.array.isRequired,
    datafeedsData: PropTypes.array.isRequired,
    providerActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { streamSpecActions, match } = this.props;

    streamSpecActions.fetchStreamSpec({ fqon: match.params.fqon, id: match.params.streamId });
  }

  onShowEntitlements = () => {
    const { entitlementActions, streamSpec, match } = this.props;

    entitlementActions.showEntitlementsModal(streamSpec.name, match.params.fqon, streamSpec.id, 'streamspecs', 'Stream Specification');
  }

  onSubmit = (values) => {
    const { match, history, streamSpecActions, initialFormValues } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs/${response.id}`);
    const payload = generatePatches(initialFormValues, values);

    streamSpecActions.updateStreamSpec({ fqon: match.params.fqon, id: match.params.streamId, payload, onSuccess });
  };

  render() {
    const { streamSpecPending, streamSpec, lambdasData, datafeedsData, initialFormValues, providerActions } = this.props;

    return (
      streamSpecPending && !streamSpec.id ?
        <ActivityContainer id="streamspec-loading" /> :
        <Row justifyContent="center">
          <Col flex={8} xs={12} sm={12} md={10}>
            <Form
              title={streamSpec.name}
              editMode
              onSubmit={this.onSubmit}
              initialValues={initialFormValues}
              render={streamspecForm}
              validate={validate}
              loading={streamSpecPending}
              onShowEntitlements={this.onShowEntitlements}
              lambdas={lambdasData}
              datafeeds={datafeedsData}
              streamSpec={streamSpec}
              providerActions={providerActions}
            />
          </Col>
        </Row>
    );
  }
}

const mapStatetoProps = state => ({
  initialFormValues: getStreamSpec(state),
});

export default compose(
  // withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withProviderActions({ filter: 'streamspec.edit' }),
  withPickerData({ entity: 'datafeeds', label: 'Data Feeds' }),
  withPickerData({ entity: 'lambdas', label: 'Lambdas' }),
  withStreamSpec,
  withEntitlements,
  withRouter,
  connect(mapStatetoProps)
)(StreamSpecEdit);
