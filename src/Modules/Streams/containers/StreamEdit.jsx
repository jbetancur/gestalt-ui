import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { Button } from 'components/Buttons';
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
import withStreamSpec from '../hocs/withStreamSpec';

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
    providerActions: PropTypes.array.isRequired,
    instanceProviderActions: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.populateStreamSpecs();
  }

  onShowEntitlements = () => {
    const { entitlementActions, streamSpec, match } = this.props;

    entitlementActions.showEntitlementsModal(streamSpec.name, match.params.fqon, streamSpec.id, 'streamspecs', 'Stream');
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

    streamSpecActions.initStreamSpecEdit({ streamSpecId: match.params.streamId });
  }

  render() {
    const {
      match,
      streamSpecPending,
      streamSpec,
      streamInstances,
      initialFormValues,
      providerActions,
      instanceProviderActions,
    } = this.props;

    return (
      streamSpecPending && !streamSpec.id ?
        <ActivityContainer id="streamspec-loading" /> :
        <Row center>
          <Col flex={10} xs={12} sm={12} md={10}>
            <ActionsToolbar
              title={streamSpec.name}
              actions={[
                <Button
                  key="streamspec--refresh"
                  flat
                  iconChildren="refresh"
                  onClick={() => this.populateStreamSpecs()}
                  primary
                >
                  Refresh
                </Button>,
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
                  actionList={providerActions}
                  fqon={match.params.fqon}
                />
              ]}
            />

            {streamSpecPending && <ActivityContainer id="streamspec-form" />}

            <Tabs>
              <Tab title="Instances">
                <StreamInstances
                  streamSpec={streamSpec}
                  streamInstances={streamInstances}
                  fqon={match.params.fqon}
                  providerActions={instanceProviderActions}
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
              <Tab title="Configuration">
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
                  {...this.props}
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
  withStreamSpec,
  withEntitlements,
  withRouter,
  connect(mapStatetoProps)
)(StreamSpecEdit);
