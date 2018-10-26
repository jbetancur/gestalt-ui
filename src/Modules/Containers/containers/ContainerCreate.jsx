import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import createDecorator from 'final-form-focus';
import Form from 'components/Form';
import arrayMutators from 'final-form-arrays';
import { Col, Row } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import ContainerForm from './ContainerForm';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import {
  getCreateContainerModel,
  selectProvider,
  selectVolumeListing,
} from '../selectors';
import iconMap from '../../Providers/config/iconMap';
import withContainer from '../hocs/withContainer';

const focusOnErrors = createDecorator();

class ContainerCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    containerActions: PropTypes.object.isRequired,
    inlineMode: PropTypes.bool,
    containerPending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    containerVolumes: PropTypes.array.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
  };

  componentDidMount() {
    const { containerActions } = this.props;

    containerActions.initContainerCreate();
  }

  create = (values) => {
    const { match, history, containerActions, inlineMode, containerVolumes } = this.props;

    if (!inlineMode) {
      const payload = generatePayload(values, false, containerVolumes);
      // Since we hide the selected provider we need to get this from redux and patch it onto the payload
      const onSuccess = (response) => {
        history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers/${response.id}`);
      };

      containerActions.createContainer({ fqon: match.params.fqon, environmentId: match.params.environmentId, payload, onSuccess });
    }
  }

  render() {
    const {
      containerPending,
      initialFormValues,
      inlineMode,
      selectedProvider,
    } = this.props;

    const isPending = !inlineMode && containerPending;

    return (
      <Row gutter={5} center>
        <Col
          flex={inlineMode ? 12 : 10}
          xs={12}
          sm={12}
          md={12}
        >
          <ActionsToolbar
            title="Deploy a Container"
            subtitle={selectedProvider.provider.name}
            titleIcon={iconMap(selectedProvider.type)}
          />

          {containerPending && <ActivityContainer id="container-form" />}

          <FinalForm
            onSubmit={this.create}
            decorators={[focusOnErrors]}
            mutators={{ ...arrayMutators }}
            loading={isPending}
            initialValues={initialFormValues}
            validate={validate}
            inlineMode={inlineMode}
            render={({ handleSubmit, ...rest }) => (
              <Form onSubmit={handleSubmit} autoComplete="off" disabled={isPending}>
                <ContainerForm {...rest} />
              </Form>
            )}
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getCreateContainerModel(state),
  selectedProvider: selectProvider(state),
  containerVolumes: selectVolumeListing(state),
});

export default compose(
  withContainer(),
  withRouter,
  connect(mapStateToProps, actions),
)(ContainerCreate);
