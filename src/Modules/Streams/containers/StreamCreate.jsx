import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { withStreamSpec, withPickerData } from 'Modules/MetaResource';
import { Form } from 'react-final-form';
import { generateContextEntityState } from 'util/helpers/context';
import StreamForm from './StreamForm';
import validate from '../validations';

const initialValues = {
  name: null,
  properties: {
    provider: 'aa0e4ff3-9744-4f41-bb31-917216826da8',
    cpus: 1,
    mem: 512,
    parallelization: 1,
    processor: {
      type: 'map',
      lambda_id: null,
      input_stream_config: {
        name: null,
        feed_id: null,
        partition: {
          partition: 0,
          start_offset: -1,
          end_offset: -1,
        },
      },
      output_stream_config: {
        name: null,
        feed_id: null,
      }
    },
  },
};

class StreamCreate extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    lambdasData: PropTypes.array.isRequired,
    datafeedsData: PropTypes.array.isRequired,
    streamSpecActions: PropTypes.object.isRequired,
  };

  onSubmit = (values) => {
    const { match, history, streamSpecActions } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs/${response.id}`);
    const entity = generateContextEntityState(match.params);

    streamSpecActions.createStreamSpec({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, payload: values, onSuccess });
  };

  render() {
    const { lambdasData, datafeedsData } = this.props;

    return (
      <Row center>
        <Col flex={8}>
          <Form
            title="Create a Stream Specification"
            onSubmit={this.onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={StreamForm}
            lambdas={lambdasData}
            datafeeds={datafeedsData}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  // withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withPickerData({ entity: 'datafeeds', label: 'Data Feeds' }),
  withPickerData({ entity: 'lambdas', label: 'Lambdas' }),
  withStreamSpec,
)(StreamCreate);
