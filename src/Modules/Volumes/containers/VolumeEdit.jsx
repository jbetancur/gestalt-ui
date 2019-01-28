import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import arrayMutators from 'final-form-arrays';
import { Col, Row } from 'react-flexybox';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { Panel } from 'components/Panels';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import { ALink } from 'components/Links';
import { Tabs, Tab } from 'components/Tabs';
import { Card } from 'components/Cards';
import PayloadViewer from '../components/PayloadViewer';
import VolumeForm from './VolumeForm';
import actions from '../actions';
import { generatePatches } from '../payloadTransformer';
import { getEditVolumeModel, selectProvider } from '../reducers/selectors';
import withVolume from '../hocs/withVolume';

class VolumeEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    volume: PropTypes.object.isRequired,
    volumeActions: PropTypes.object.isRequired,
    volumePending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    clearSelectedProvider: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, volumeActions } = this.props;

    volumeActions.fetchVolume({ fqon: match.params.fqon, id: match.params.volumeId, params: { embed: 'container' } });
  }

  componentWillUnmount() {
    const { clearSelectedProvider } = this.props;

    clearSelectedProvider();
  }

  update = (values) => {
    const { match, volume, volumeActions } = this.props;
    const payload = generatePatches(volume, values);

    volumeActions.updateVolume({ fqon: match.params.fqon, id: volume.id, payload });
  }

  render() {
    const {
      match,
      volume,
      volumePending,
      entitlementActions,
      initialFormValues,
      selectedProvider,
    } = this.props;

    if (volumePending && !volume.id) {
      return <ActivityContainer id="volume-edit-loading" />;
    }

    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>

          <ActionsToolbar
            title={volume.name}
            showBackNav
            navTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/volumes`}
            subtitle={(
              <React.Fragment>
                <div>{`Provider: ${volume.properties.provider.name}`}</div>
                {volume.properties.container &&
                  <div>
                    <span>Container: </span>
                    <ALink
                      to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers/${volume.properties.container.id}`}
                      primary
                    >
                      {volume.properties.container.name}
                    </ALink>
                  </div>}
              </React.Fragment>
            )
            }
            actions={[
              <Button
                key="volume--entitlements"
                flat
                iconChildren="security"
                onClick={() => entitlementActions.showEntitlementsModal(volume.name, match.params.fqon, volume.id, 'volumes', 'volume')}
              >
                Entitlements
              </Button>]
            }
          />

          {volumePending && <ActivityContainer id="volume-form" />}

          <Tabs>
            <Tab title="Volume">
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Resource Details" defaultExpanded={false}>
                    <DetailsPane model={volume} />
                  </Panel>
                </Col>
              </Row>

              <FinalForm
                editMode
                onSubmit={this.update}
                mutators={{ ...arrayMutators }}
                loading={volumePending}
                initialValues={initialFormValues}
                selectedProvider={selectedProvider}
                render={({ handleSubmit, submitting, ...rest }) => (
                  <Form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    disabled={volumePending}
                    disabledSubmit={volumePending || submitting}
                    submitTitle="Update"
                  >
                    <VolumeForm {...rest} />
                  </Form>
                )}
              />
            </Tab>

            <Tab title="YAML/JSON">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <PayloadViewer
                      value={volume}
                      name={volume.name}
                    />
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getEditVolumeModel(state),
  selectedProvider: selectProvider(state),
});

export default compose(
  withVolume(),
  withEntitlements,
  connect(mapStateToProps, actions),
)(VolumeEdit);
