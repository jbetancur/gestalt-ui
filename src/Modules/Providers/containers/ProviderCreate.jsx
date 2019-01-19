import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm, Field } from 'react-final-form';
import Form from 'components/Form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { Col, Row } from 'react-flexybox';
import { Checkbox } from 'react-md';
import { SelectField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { Button } from 'components/Buttons';
import { Caption } from 'components/Typography';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import ProviderForm from './ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPayload } from '../payloadTransformer';
import { getCreateProviderModel } from '../selectors';
import withProvider from '../hocs/withProvider';
import containerModel from '../../Containers/models/container';

const focusOnErrors = createDecorator();
const stripProviderTypeKeys = ['supportsURL', 'supportsCMD', 'supportsPortType', 'allowLinkedProviders', 'allowEnvVariables', 'DCOSConfig', 'dataConfig', 'inputType', 'allowStorageClasses', 'subTypes', 'showContainerOption', 'networksConfig', 'ecsConfig'];

class ProviderCreate extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    providerActions: PropTypes.object.isRequired,
    providerPending: PropTypes.bool.isRequired,
    hasContainer: PropTypes.bool.isRequired,
    resourceTypes: PropTypes.array.isRequired,
    selectedProviderType: PropTypes.object.isRequired,
    setSelectedProviderType: PropTypes.func.isRequired,
    toggleHasContainer: PropTypes.func.isRequired,
    envSchemaPending: PropTypes.bool.isRequired,
  };

  state = {
    pageOneDone: false,
    providerSelected: false,
    showContainerOption: false,
    containerChecked: false,
  }

  componentDidMount() {
    const { providerActions } = this.props;

    providerActions.initProviderCreate();
  }

  componentDidUpdate(prevProps, prevState) {
    const { toggleHasContainer } = this.props;

    if (prevState.containerChecked !== this.state.containerChecked && this.state.showContainerOption) {
      toggleHasContainer(this.state.containerChecked);
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
  }

  create = (values) => {
    const { match, history, providerActions, hasContainer } = this.props;
    const payload = generateProviderPayload(values, hasContainer);

    const onSuccess = (response) => {
      if (match.params.workspaceId && !match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers/${response.id}`);
      } else if (match.params.workspaceId && match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers/${response.id}`);
      } else {
        history.push(`/${match.params.fqon}/providers/${response.id}`);
      }
    };

    if (match.params.workspaceId && !match.params.environmentId) {
      providerActions.createProvider({ fqon: match.params.fqon, entityId: match.params.workspaceId, entityKey: 'workspaces', payload, onSuccess });
    } else if (match.params.environmentId) {
      providerActions.createProvider({ fqon: match.params.fqon, entityId: match.params.environmentId, entityKey: 'environments', payload, onSuccess });
    } else {
      providerActions.createProvider({ fqon: match.params.fqon, payload, onSuccess });
    }
  }

  goBack = () => {
    const { match, history } = this.props;
    if (match.params.workspaceId && !match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers`);
    } else if (match.params.workspaceId && match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers`);
    } else {
      history.push(`/${match.params.fqon}/providers`);
    }
  };

  handleProviderChange = form => (value) => {
    const { resourceTypes, setSelectedProviderType } = this.props;
    const providerType = resourceTypes.find(type => type.name === value);

    form.change('resource_type', value);

    if (providerType.id) {
      setSelectedProviderType({ fqon: 'root', providerType });
      this.setState({
        providerSelected: true,
        showContainerOption: providerType.showContainerOption,
        containerOptionSelected: !providerType.showContainerOption,
        containerChecked: providerType.showContainerOption,
      });
    }
  };

  handleUsesContainer = form => () => {
    form.change('properties.services[0].container_spec', containerModel.get());
    this.setState(state => ({ containerChecked: !state.containerChecked }));
  }

  handleNextPage = () => {
    this.setState({ pageOneDone: true });
  }

  render() {
    const {
      initialValues,
      providerPending,
      selectedProviderType,
      hasContainer,
      resourceTypes,
      envSchemaPending,
    } = this.props;

    const {
      pageOneDone,
      providerSelected,
      showContainerOption,
      containerChecked,
    } = this.state;

    return (
      <Row center gutter={5}>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={selectedProviderType.name ? `Create a ${selectedProviderType.displayName} Provider` : 'Create a Provider'}
          />

          {(providerPending || envSchemaPending) && <ActivityContainer id="provider-form" />}

          <FinalForm
            initialValues={initialValues}
            validate={validate(hasContainer)}
            mutators={{ ...arrayMutators }}
            decorators={[focusOnErrors]}
            onSubmit={this.create}
            goBack={this.goBack}
            keepDirtyOnReinitialize
            subscription={{ submitting: true, pristine: true }}
            render={({ handleSubmit, form, ...rest }) => {
              if (!pageOneDone) {
                return (
                  <Row gutter={5}>
                    <Col flex={12}>
                      <Panel title="Select a Provider Type" expandable={false}>
                        <Row>
                          <Col flex={12}>
                            <Field
                              id="select-provider-type"
                              component={SelectField}
                              name="resource_type"
                              menuItems={resourceTypes}
                              itemLabel="displayName"
                              itemValue="name"
                              label="Provider Type"
                              onChange={this.handleProviderChange(form)}
                              required
                              deleteKeys={stripProviderTypeKeys}
                              async
                            />
                          </Col>

                          {showContainerOption && (
                            <Col flex={12}>
                              <Checkbox
                                id="requires-container"
                                name="requires-container"
                                label="Requires Container"
                                onChange={this.handleUsesContainer(form)}
                                checked={containerChecked}
                              />
                              <Caption light>By default this provider allows you to configure a container</Caption>
                            </Col>
                          )}

                          <Row gutter={10}>
                            <Col flex={12}>
                              <Button
                                raised
                                primary
                                onClick={this.handleNextPage}
                                disabled={!providerSelected || providerPending || envSchemaPending}
                              >
                                Next
                              </Button>
                            </Col>
                          </Row>
                        </Row>
                      </Panel>
                    </Col>
                  </Row>
                );
              }

              return (
                <Form onSubmit={handleSubmit} disabled={providerPending} autoComplete="off">
                  <ProviderForm form={form} {...rest} />
                </Form>
              );
            }}
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialValues: getCreateProviderModel(state),
});

export default compose(
  withProvider(),
  connect(mapStateToProps, actions),
)(ProviderCreate);
