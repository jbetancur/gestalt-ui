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
import actions from '../actions';
import {
  getCreateContainerModel,
  selectProvider,
  selectVolumeListing,
} from '../reducers/selectors';
import iconMap from '../../Providers/config/iconMap';
import withContainer from '../hocs/withContainer';
import containerModel from '../models/container';

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
      const payload = containerModel.create(values, containerVolumes);
      // Since we hide the selected provider we need to get this from redux and patch it onto the payload
      const onSuccess = (response) => {
        if (response.properties && response.properties.message === 'This function has been suppressed.') {
          history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`);
        } else {
          history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers/${response.id}`);
        }
      };

      containerActions.createContainer({ fqon: match.params.fqon, environmentId: match.params.environmentId, payload, onSuccess });
    }
  }

  render() {
    const {
      match,
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
            initialValues={initialFormValues}
            inlineMode={inlineMode}
            render={({ handleSubmit, submitting, ...rest }) => (
              <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                disabled={isPending}
                disabledCancel={containerPending || submitting}
                disabledSubmit={containerPending || submitting || !selectedProvider.isSelected}
                submitTitle="Create"
                showCancel
                cancelTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`}
              >
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
