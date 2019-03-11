import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { Col, Row } from 'react-flexybox';
import Checkbox from 'components/Fields/Checkbox';
import { Panel } from 'components/Panels';
import { FlatButton } from 'components/Buttons';
import { Caption } from 'components/Typography';
import { ActivityContainer } from 'components/ProgressIndicators';
import AutoComplete from 'components/Fields/AutoComplete';
import ActionsToolbar from 'components/ActionsToolbar';
import ProviderForm from './ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { getCreateProviderModel } from '../reducers/selectors';
import withProvider from '../hocs/withProvider';
import providerModel from '../models/provider';

const focusOnErrors = createDecorator();

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;

  button {
    margin: 5px;
  }
`;

class ProviderCreate extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    providerActions: PropTypes.object.isRequired,
    providerPending: PropTypes.bool.isRequired,
    hasContainer: PropTypes.bool.isRequired,
    selectedProviderType: PropTypes.object.isRequired,
    setSelectedProviderType: PropTypes.func.isRequired,
    toggleHasContainer: PropTypes.func.isRequired,
    envSchemaPending: PropTypes.bool.isRequired,
    resourceTypes: PropTypes.array,
  };

  static defaultProps = {
    resourceTypes: [],
  }

  state = {
    pageOneDone: false,
    providerResourceTypeValue: '',
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

  formatPayload(values) {
    const { selectedProviderType } = this.props;
    const { providerResourceTypeValue } = this.state;
    // merge resource_type into form
    const payload = { ...values, ...{ resource_type: providerResourceTypeValue } };

    // use the correct model to format the provider payload
    if (selectedProviderType.model) {
      return selectedProviderType.model.create(payload);
    }

    return providerModel.create(payload);
  }

  create = (values) => {
    const { match, history, providerActions } = this.props;
    const payload = this.formatPayload(values);

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

  handleProviderChange = (value) => {
    const { resourceTypes, setSelectedProviderType } = this.props;
    const providerType = resourceTypes.find(type => type.name === value.value);

    if (providerType.id) {
      setSelectedProviderType({ fqon: 'root', providerType });
      this.setState({
        providerSelected: true,
        providerResourceTypeValue: value.value,
        showContainerOption: providerType.showContainerOption,
        containerOptionSelected: !providerType.showContainerOption,
        containerChecked: providerType.showContainerOption,
      });
    }
  };

  handleUsesContainer = () => {
    // form.change('properties.services[0].container_spec', containerModel.get());
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

    if (providerPending && !providerSelected) {
      return <ActivityContainer id="provider-loading" />;
    }

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
            subscription={{ submitting: true, pristine: true }}
            render={({ handleSubmit, submitting, form, ...rest }) => {
              if (!pageOneDone) {
                return (
                  <Row gutter={5}>
                    <Col flex={12}>
                      <Panel title="Select a Provider Type" expandable={false}>
                        <Row>
                          <Col flex={12}>
                            <AutoComplete
                              id="select-provider-type"
                              data={resourceTypes}
                              label="Search for a Resource Type"
                              dataLabel="displayName"
                              dataValue="name"
                              onSelected={this.handleProviderChange}
                              noOptionsMessage={() => 'no resource types were found'}
                              autoFocus
                            />
                          </Col>

                          {showContainerOption && (
                            <Col flex={12}>
                              <Checkbox
                                id="requires-container"
                                name="requires-container"
                                label="Requires Container"
                                onChange={this.handleUsesContainer}
                                checked={containerChecked}
                              />
                              <Caption light>By default this provider allows you to configure a container</Caption>
                            </Col>
                          )}

                          <ButtonWrapper>
                            <FlatButton
                              label="Cancel"
                              component={Link}
                              to={this.generateBackLink()}
                            />
                            <FlatButton
                              label="Next"
                              variant="contained"
                              color="primary"
                              onClick={this.handleNextPage}
                              disabled={!providerSelected || providerPending || envSchemaPending}
                            />
                          </ButtonWrapper>
                        </Row>
                      </Panel>
                    </Col>
                  </Row>
                );
              }

              return (
                <Form
                  onSubmit={handleSubmit}
                  disabled={providerPending}
                  autoComplete="off"
                  disabledSubmit={providerPending || submitting}
                  submitTitle="Create"
                  showCancel
                  cancelTo={this.generateBackLink()}
                >
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
