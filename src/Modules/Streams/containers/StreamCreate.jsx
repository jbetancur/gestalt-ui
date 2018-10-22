import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { Form } from 'react-final-form';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import { generateContextEntityState } from 'util/helpers/context';
import StreamForm from './StreamForm';
import validate from '../validations';
import streamSpecModel from '../models/streamSpec';
import withStreamSpec from '../hocs/withStreamSpec';

const initialValues = streamSpecModel.create({
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
    streamSpecActions: PropTypes.object.isRequired,
    streamSpecPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { streamSpecActions } = this.props;

    streamSpecActions.initStreamSpecCreate();
  }

  onSubmit = (values) => {
    const { match, history, streamSpecActions } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs/${response.id}`);
    const entity = generateContextEntityState(match.params);

    streamSpecActions.createStreamSpec({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, payload: values, onSuccess });
  };

  render() {
    const { streamSpecPending } = this.props;

    return (
      <Row center>
        <Col flex={10} xs={12} sm={12} md={10}>
          <ActionsToolbar title="Create a Stream" />

          {streamSpecPending && <ActivityContainer id="datafeed-form" />}

          <Form
            onSubmit={this.onSubmit}
            initialValues={initialValues}
            validate={validate}
            render={StreamForm}
            loading={streamSpecPending}
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withStreamSpec,
)(StreamCreate);
