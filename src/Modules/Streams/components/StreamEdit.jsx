import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { Form as FinalForm } from 'react-final-form';
import createDecorator from 'final-form-focus';
import Form from 'components/Form';
import { Card } from 'components/Cards';
import { Button } from 'components/Buttons';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import { ActionsMenu } from 'Modules/Actions';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Tabs, Tab } from 'components/Tabs';
import { FullPageFooter } from 'components/FullPage';
import PayloadViewer from './PayloadViewer';
import StreamForm from './StreamForm';
import StreamInstances from './StreamInstances';
import validate from '../validations';
import { getStreamSpec, getStreamInstances } from '../selectors';
import { generatePatches } from '../payloadTransformer';
import withStreamSpec from '../hocs/withStreamSpec';

const focusOnErrors = createDecorator();

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
    lambdas: PropTypes.array.isRequired,
    datafeeds: PropTypes.array.isRequired,
    providers: PropTypes.array.isRequired,
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
            actions={[
              <ActionsMenu
                key="streamspec--actions"
                actionList={providerActions}
                fqon={match.params.fqon}
                resource={streamSpec}
              />,
              <Button
                key="streamspec--entitlements"
                flat
                iconChildren="security"
                onClick={this.onShowEntitlements}
              >
                Entitlements
              </Button>,
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
                      onRefresh={() => this.populateStreamSpecs()}
                    />
                  </Card>
                </Col>
              </Row>
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

              <FinalForm
                editMode
                lambdas={lambdas}
                datafeeds={datafeeds}
                providers={providers}
                onSubmit={this.onSubmit}
                initialValues={initialFormValues}
                validate={validate}
                decorators={[focusOnErrors]}
                render={({ handleSubmit, values, submitting, ...rest }) => (
                  <Form onSubmit={handleSubmit} disabled={streamSpecPending}>
                    <StreamForm {...rest} />
                    <FullPageFooter>
                      <Button
                        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs`}
                        flat
                        component={Link}
                        iconChildren="arrow_back"
                      >
                        Stream Specs
                      </Button>

                      <Button
                        type="submit"
                        primary
                        raised
                        disabled={submitting}
                      >
                        Update
                      </Button>
                    </FullPageFooter>
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
  withEntitlements,
  withRouter,
  connect(mapStatetoProps)
)(StreamSpecEdit);
