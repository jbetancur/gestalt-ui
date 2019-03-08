import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import createDecorator from 'final-form-focus';
import { Card } from 'components/Cards';
import { FlatButton } from 'components/Buttons';
import { EntitlementIcon } from 'components/Icons';
import { ActivityContainer } from 'components/ProgressIndicators';
import { ActionsMenu } from 'Modules/Actions';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Tabs, Tab } from 'components/Tabs';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import PayloadViewer from './PayloadViewer';
import StreamForm from './StreamForm';
import StreamInstances from './StreamInstances';
import { getStreamSpec, getStreamInstances } from '../reducers/selectors';
import withStreamSpec from '../hocs/withStreamSpec';
import streamSpecModel from '../models/streamSpec';

const focusOnErrors = createDecorator();

class StreamSpecEdit extends Component {
  static propTypes = {
    streamSpecActions: PropTypes.object.isRequired,
    streamSpec: PropTypes.object.isRequired,
    streamInstances: PropTypes.array.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    streamSpecPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    providerActions: PropTypes.array.isRequired,
    instanceProviderActions: PropTypes.array.isRequired,
    lambdas: PropTypes.array.isRequired,
    datafeeds: PropTypes.array.isRequired,
    providers: PropTypes.array.isRequired,
  };

  static contextType = ModalConsumer;

  componentDidMount() {
    this.populateStreamSpecs();
  }

  onShowEntitlements = () => {
    const { streamSpec } = this.props;
    const { showModal } = this.context;

    showModal(EntitlementModal, {
      title: `Entitlements for "${streamSpec.name}" Stream`,
      fqon: streamSpec.org.properties.fqon,
      entityId: streamSpec.id,
      entityKey: 'streamspecs',
    });
  }

  onSubmit = (values) => {
    const { match, history, streamSpecActions, initialFormValues } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs/${response.id}`);
    const payload = streamSpecModel.patch(initialFormValues, values);

    streamSpecActions.updateStreamSpec({ fqon: match.params.fqon, id: match.params.streamId, payload, onSuccess });
  };

  populateStreamSpecs = () => {
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
      lambdas,
      datafeeds,
      providers,
    } = this.props;

    if (streamSpecPending && !streamSpec.id) {
      return <ActivityContainer id="streamspec-loading" />;
    }

    return (
      <Row center>
        <Col flex={10} xs={12} sm={12} md={10}>
          <ActionsToolbar
            title={streamSpec.name}
            sticky
            showBackNav
            navTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs`}
            actions={[
              <ActionsMenu
                key="streamspec--actions"
                actionList={providerActions}
                fqon={match.params.fqon}
                resource={streamSpec}
              />,
              <FlatButton
                key="streamspec--entitlements"
                icon={<EntitlementIcon size={20} />}
                label="Entitlements"
                onClick={this.showEntitlements}
              />,
            ]}
          />

          {streamSpecPending && <ActivityContainer id="streamspec-form" />}

          <Tabs>
            <Tab title="Instances">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <StreamInstances
                      streamSpec={streamSpec}
                      streamInstances={streamInstances}
                      fqon={match.params.fqon}
                      providerActions={instanceProviderActions}
                    />
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab title="Configuration">
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Resource Details" defaultExpanded={false}>
                    <DetailsPane model={streamSpec} />
                  </Panel>
                </Col>
              </Row>

              <FinalForm
                editMode
                lambdas={lambdas}
                datafeeds={datafeeds}
                providers={providers}
                onSubmit={this.onSubmit}
                initialValues={initialFormValues}
                decorators={[focusOnErrors]}
                render={({ handleSubmit, submitting, ...rest }) => (
                  <Form
                    onSubmit={handleSubmit}
                    submitTitle="Update"
                    disabled={streamSpecPending}
                    disabledSubmit={submitting}
                  >
                    <StreamForm {...rest} />
                  </Form>
                )}
              />
            </Tab>

            <Tab title="YAML/JSON">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <PayloadViewer
                      value={streamSpec}
                      name={streamSpec.name}
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

const mapStatetoProps = state => ({
  initialFormValues: getStreamSpec(state),
  streamInstances: getStreamInstances(state),
});

export default compose(
  withStreamSpec,
  withRouter,
  connect(mapStatetoProps)
)(StreamSpecEdit);
