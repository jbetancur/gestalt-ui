import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { withStreamSpec, withPickerData, metaModels } from 'Modules/MetaResource';
import { Form } from 'react-final-form';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import { generateContextEntityState } from 'util/helpers/context';
import StreamForm from './StreamForm';
import validate from '../validations';

const initialValues = metaModels.streamSpec.create({
  properties: {
    cpus: 1,
    mem: 512,
    parallelization: 1,
    processor: {
      type: 'map',
      inputStreamConfig: {
        partitions: [{
          partition: 0,
          startOffset: -1,
          endOffset: -1,
        }]
      },
    },
  },
});

class StreamCreate extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    lambdasData: PropTypes.array.isRequired,
    datafeedsData: PropTypes.array.isRequired,
    providersData: PropTypes.array.isRequired,
    streamSpecActions: PropTypes.object.isRequired,
    streamSpecPending: PropTypes.bool.isRequired,
  };

  onSubmit = (values) => {
    const { match, history, streamSpecActions } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs/${response.id}`);
    const entity = generateContextEntityState(match.params);

    streamSpecActions.createStreamSpec({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, payload: values, onSuccess });
  };

  render() {
    const { lambdasData, datafeedsData, providersData, streamSpecPending } = this.props;

    return (
      <Row center>
        <Col flex={8} xs={12} sm={12} md={10}>
          <ActionsToolbar title="Create a Stream Specification" />

          {streamSpecPending && <ActivityContainer id="datafeed-form" />}

          <Form
            onSubmit={this.onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={StreamForm}
            loading={streamSpecPending}
            lambdas={lambdasData}
            datafeeds={datafeedsData}
            providers={providersData}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withPickerData({ entity: 'providers', label: 'Stream Providers', params: { type: 'StreamProvider' } }),
  withPickerData({ entity: 'datafeeds', label: 'Data Feeds' }),
  withPickerData({ entity: 'lambdas', label: 'Lambdas' }),
  withStreamSpec,
)(StreamCreate);
