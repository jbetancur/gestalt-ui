import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { Col, Row } from 'react-flexybox';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { ContainerActions, ContainerInstances, ContainerServiceAddresses } from 'Modules/Containers';
import { ActivityContainer } from 'components/ProgressIndicators';
import { FlatButton } from 'components/Buttons';
import { EntitlementIcon } from 'components/Icons';
import LaunchIcon from '@material-ui/icons/Launch';
import ActionsToolbar from 'components/ActionsToolbar';
import { Tabs, Tab } from 'components/Tabs';
import { Card, CardTitle } from 'components/Cards';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import PayloadViewer from './PayloadViewer';
import ProviderForm from './ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { getEditProviderModel, getProviderContainer } from '../reducers/selectors';
import withProvider from '../hocs/withProvider';
import providerModel from '../models/provider';

const focusOnErrors = createDecorator();

class ProviderEdit extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    providerPending: PropTypes.bool.isRequired,
    providerActions: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    selectedProviderType: PropTypes.object.isRequired,
    hasContainer: PropTypes.bool.isRequired,
  };

  static contextType = ModalConsumer;

  componentDidMount() {
    const { match, providerActions } = this.props;

    providerActions.initProviderEdit({ providerId: match.params.providerId });
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
  }

  populateProvider() {
    const { match, providerActions } = this.props;

    providerActions.fetchProvider({ fqon: match.params.fqon, id: match.params.providerId });
  }

  handleRedeploy = () => {
    const { match, provider, providerActions } = this.props;
    const { showModal } = this.context;
    const onProceed = () => providerActions.redeployProvider({ fqon: match.params.fqon, id: provider.id });

    showModal(ConfirmModal, {
      title: `"${provider.name}" provider container will be re-deployed. Are you sure you want to proceed?`,
      onProceed,
      proceedLabel: 'Redeploy',
      forceOption: false,
    });
  }

  formatPayload(values) {
    const { provider, selectedProviderType } = this.props;
    // use the correct model to format the provider payload
    if (selectedProviderType.model) {
      return selectedProviderType.model.patch(provider, values);
    }

    return providerModel.patch(provider, values);
  }

  update = (formValues) => {
    const { match, provider, providerActions } = this.props;


    providerActions.updateProvider({ fqon: match.params.fqon, id: provider.id, payload: this.formatPayload(formValues) });
  }

  generateBackLink() {
    const { match } = this.props;

    if (match.params.workspaceId && !match.params.environmentId) {
      return `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers`;
    }

    if (match.params.workspaceId && match.params.environmentId) {
      return `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers`;
    }

    return `/${match.params.fqon}/providers`;
  }

  showEntitlements = () => {
    const { provider } = this.props;
    const { showModal } = this.context;

    showModal(EntitlementModal, {
      title: `Entitlements for "${provider.name}" Provider`,
      fqon: provider.org.properties.fqon,
      entityId: provider.id,
      entityKey: 'providers',
    });
  }

  render() {
    const {
      match,
      initialValues,
      provider,
      container,
      hasContainer,
      providerPending,
      selectedProviderType,
    } = this.props;

    if (providerPending && !provider.id) {
      return <ActivityContainer id="provider-loading" />;
    }

    return (
      <Row center gutter={5}>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={provider.name}
            showBackNav
            sticky
            navTo={this.generateBackLink()}
            actions={[
              hasContainer &&
              <ContainerActions
                key="provider-container-actions"
                inContainerView
                containerModel={container}
                disableDestroy
                disablePromote
              />,
              hasContainer &&
              <FlatButton
                key="provider-container-redeploy"
                icon={<LaunchIcon fontIcon="small" />}
                label="edeploy Container"
                type="submit"
                onClick={this.handleRedeploy}
                disabled={providerPending}
                color="primary"
              />,
              <FlatButton
                key="container--entitlements"
                icon={<EntitlementIcon size={20} />}
                label="Entitlements"
                onClick={this.showEntitlements}
              />,
            ]}
          />

          {providerPending && <ActivityContainer id="provider-form" />}

          <Tabs>
            <Tab title="Configuration">
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Resource Details" defaultExpanded={false}>
                    <DetailsPane model={provider} />
                  </Panel>
                </Col>
              </Row>

              <FinalForm
                initialValue={initialValues}
                validate={validate(hasContainer)}
                mutators={{ ...arrayMutators }}
                decorators={[focusOnErrors]}
                editMode
                onSubmit={this.update}
                subscription={{ submitting: true, pristine: true }}
                render={({ handleSubmit, submitting, ...rest }) => (
                  <Form
                    onSubmit={handleSubmit}
                    disabled={providerPending}
                    autoComplete="off"
                    submitTitle="Update"
                    disabledSubmit={providerPending || submitting}
                  >
                    <ProviderForm {...rest} />
                  </Form>
                )}
                {...this.props}
              />
            </Tab>

            {hasContainer ? (
              <Tab title="Service Instance">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Card>
                      <CardTitle title="Instances" />
                      <ContainerInstances
                        containerModel={container}
                        fqon={match.params.fqon}
                      />
                    </Card>
                  </Col>
                </Row>

                <Row gutter={5}>
                  <Col flex={12}>
                    <Card>
                      <CardTitle title="Service Addresses" />
                      <ContainerServiceAddresses
                        portMappings={container.properties.port_mappings}
                      />
                    </Card>
                  </Col>
                </Row>
              </Tab>) : <div />
            }

            <Tab title="YAML/JSON">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <PayloadViewer
                      providerType={selectedProviderType}
                      value={provider}
                      name={provider.name}
                    />
                  </Card>
                </Col>
              </Row>
            </Tab>

            {/* <Tab title="Environment">
              <EnvironmentListing {...this.props} />
            </Tab> */}
          </Tabs>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialValues: getEditProviderModel(state),
  providerContainer: getProviderContainer(state),
});

export default compose(
  withProvider(),
  connect(mapStateToProps, actions),
)(ProviderEdit);
