import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import arrayMutators from 'final-form-arrays';
import { Col, Row } from 'react-flexybox';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import { generateContextEntityState } from 'util/helpers/context';
import VolumeForm from './VolumeForm';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateVolumeModel, selectProvider } from '../reducers/selectors';
import withVolume from '../hocs/withVolume';

class VolumeCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    volumeActions: PropTypes.object.isRequired,
    volumePending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    clearSelectedProvider: PropTypes.func.isRequired,
  };

  create = (values) => {
    const { match, history, volumeActions } = this.props;
    const payload = generatePayload(values);
    const entity = generateContextEntityState(match.params);
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/volumes/${response.id}`);

    volumeActions.createVolume({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, payload, onSuccess });
  }

  componentWillUnmount() {
    const { clearSelectedProvider } = this.props;

    clearSelectedProvider();
  }

  render() {
    const {
      match,
      volumePending,
      initialFormValues,
      selectedProvider,
    } = this.props;

    return (
      <Row center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create a Volume" />

          {volumePending && <ActivityContainer id="volume-create-loading" />}

          <FinalForm
            onSubmit={this.create}
            mutators={{ ...arrayMutators }}
            initialValues={initialFormValues}
            selectedProvider={selectedProvider}
            render={({ handleSubmit, submitting, ...rest }) => (
              <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                disabled={volumePending}
                disabledSubmit={volumePending || submitting}
                submitTitle="Create"
                showCancel
                cancelTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/volumes`}
              >
                <VolumeForm {...rest} />
              </Form>
            )}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getCreateVolumeModel(state),
  selectedProvider: selectProvider(state),
});

export default compose(
  withVolume(),
  connect(mapStateToProps, actions),
)(VolumeCreate);
