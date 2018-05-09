import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { Button } from 'components/Buttons';
import { withStreamSpec, withPickerData, withProviderActions } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { Form } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import { ActionsMenu } from 'Modules/Actions';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Tabs, Tab } from 'components/Tabs';
import { FullPageFooter } from 'components/FullPage';
import StreamSpecForm from './StreamForm';
import StreamInstances from '../components/StreamInstances';
import validate from '../validations';
import { getStreamSpec, getStreamInstances } from '../selectors';
import { generatePatches } from '../payloadTransformer';

class StreamSpecEdit extends Component {
  static propTypes = {
    streamSpecActions: PropTypes.object.isRequired,
    streamSpec: PropTypes.object.isRequired,
    streamInstances: PropTypes.array.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    streamSpecPending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    lambdasData: PropTypes.array.isRequired,
    datafeedsData: PropTypes.array.isRequired,
    providersData: PropTypes.array.isRequired,
    providerActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.populateStreamSpecs();
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

  populateStreamSpecs() {
    const { streamSpecActions, match } = this.props;
    streamSpecActions.fetchStreamSpec({ fqon: match.params.fqon, id: match.params.streamId });
  }

  handleActionComplete = () => {
    setTimeout(() => this.populateStreamSpecs(), 1500);
  }

  render() {
    const {
      match,
      streamSpecPending,
      streamSpec,
      streamInstances,
      lambdasData,
      datafeedsData,
      providersData,
      initialFormValues,
      providerActions,
    } = this.props;

    return (
      streamSpecPending && !streamSpec.id ?
        <ActivityContainer id="streamspec-loading" /> :
        <Row center>
          <Col flex={8} xs={12} sm={12} md={10}>
            <ActionsToolbar
              title={streamSpec.name}
              actions={[
                <Button
                  key="streamspec--entitlements"
                  flat
                  iconChildren="security"
                  onClick={this.onShowEntitlements}
                >
                  Entitlements
                </Button>,
                <ActionsMenu
                  key="streamspec--actions"
                  model={streamSpec}
                  actionList={providerActions.providerActions}
                  pending={providerActions.providerActionsLoading}
                  onActionComplete={this.handleActionComplete}
                  fqon={match.params.fqon}
                />
              ]}
            />

            {streamSpecPending && <ActivityContainer id="streamspec-form" />}

            <Tabs>
              <Tab title="Streams">
                <StreamInstances
                  streamInstances={streamInstances}
                  fqon={match.params.fqon}
                  onActionComplete={this.handleActionComplete}
                />
                <FullPageFooter>
                  <Button
                    to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs`}
                    flat
                    component={Link}
                    iconChildren="arrow_back"
                  >
                    Stream Specs
                  </Button>
                </FullPageFooter>
              </Tab>
              <Tab title="Specification">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Panel title="Resource Details" defaultExpanded={false}>
                      <DetailsPane model={streamSpec} />
                    </Panel>
                  </Col>
                </Row>

                <Form
                  editMode
                  onSubmit={this.onSubmit}
                  initialValues={initialFormValues}
                  render={StreamSpecForm}
                  validate={validate}
                  loading={streamSpecPending}
                  lambdas={lambdasData}
                  datafeeds={datafeedsData}
                  providers={providersData}
                  streamSpec={streamSpec}
                  providerActions={providerActions}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
    );
  }
}

const mapStatetoProps = state => ({
  initialFormValues: getStreamSpec(state),
  streamInstances: getStreamInstances(state),
});

export default compose(
  withPickerData({ entity: 'providers', label: 'Stream Providers', params: { type: 'StreamProvider' } }),
  withProviderActions({ filter: 'streamspec.edit' }),
  withPickerData({ entity: 'datafeeds', label: 'Data Feeds' }),
  withPickerData({ entity: 'lambdas', label: 'Lambdas' }),
  withStreamSpec,
  withEntitlements,
  withRouter,
  connect(mapStatetoProps)
)(StreamSpecEdit);
