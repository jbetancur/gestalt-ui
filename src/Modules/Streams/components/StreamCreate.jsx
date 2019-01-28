import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
// import createDecorator from 'final-form-focus';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import { generateContextEntityState } from 'util/helpers/context';
import StreamForm from './StreamForm';
import streamSpecModel from '../models/streamSpec';
import withStreamSpec from '../hocs/withStreamSpec';

// const focusOnErrors = createDecorator();
const initialValues = streamSpecModel.create();

class StreamCreate extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    streamSpecActions: PropTypes.object.isRequired,
    streamSpecPending: PropTypes.bool.isRequired,
    lambdas: PropTypes.array.isRequired,
    datafeeds: PropTypes.array.isRequired,
    providers: PropTypes.array.isRequired,
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
    const {
      match,
      streamSpecPending,
      lambdas,
      datafeeds,
      providers,
    } = this.props;

    return (
      <Row center>
        <Col flex={10} xs={12} sm={12} md={10}>
          <ActionsToolbar title="Create a Stream" />

          {streamSpecPending && <ActivityContainer id="datafeed-form" />}

          <FinalForm
            onSubmit={this.onSubmit}
            lambdas={lambdas}
            datafeeds={datafeeds}
            providers={providers}
            initialValues={initialValues}
            // decorators={[focusOnErrors]}
            render={({ handleSubmit, submitting, ...rest }) => (
              <Form
                onSubmit={handleSubmit}
                disabled={streamSpecPending}
                disabledSubmit={submitting}
                submitTitle="Create"
                showCancel
                cancelTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs`}
              >
                <StreamForm {...rest} />
              </Form>
            )}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withStreamSpec,
)(StreamCreate);
