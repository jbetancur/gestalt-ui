import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector, destroy } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { DialogContainer } from 'react-md';
import { Stepper } from 'components/Stepper';
import { withMetaResource } from 'Modules/MetaResource';
import { generateAPIEndpointPayload } from '../payloadTransformer';
import APIForm from './APIForm';
import APIEndpointForm from './APIEndpointForm';

class APIEndpointWizard extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    modal: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    fetchAPIs: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    createAPIEndpoint: PropTypes.func.isRequired,
    apiEndpointPending: PropTypes.bool.isRequired,
    apis: PropTypes.array.isRequired,
    unloadAPIs: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    implementationId: PropTypes.string.isRequired,
    implementationType: PropTypes.string.isRequired,
    formValues: PropTypes.func.isRequired,
    portMappings: PropTypes.array,
    destroyForm: PropTypes.func.isRequired,
  };

  static defaultProps = {
    modal: false,
    portMappings: [],
  };

  state = { step: 0 };

  componentDidMount() {
    const { params, fetchAPIs } = this.props;

    fetchAPIs(params.fqon, params.environmentId);
  }

  componentWillUnmount() {
    this.props.unloadAPIs();
    this.props.destroyForm('APIEndpointMappingWizard');
  }

  nextPage = () => {
    this.setState({ step: this.state.step + 1 });
  }

  previousPage = () => {
    if (this.state.step > 0) {
      this.setState({ step: this.state.step - 1 });
    }
  }

  finish = (values) => {
    const { apiId, name } = values;
    const { createAPIEndpoint, fetchAPIEndpoints, implementationType, implementationId, params, hideModal } = this.props;

    const model = {
      name,
      properties: {
        ...values.properties,
        implementation_type: implementationType,
        implementation_id: implementationId,
      }
    };

    const payload = generateAPIEndpointPayload(model);
    const onSuccess = () => {
      const entityKey = implementationType === 'container' ? 'containers' : 'lambdas';

      fetchAPIEndpoints(params.fqon, implementationId, entityKey);
      hideModal();
    };

    createAPIEndpoint(params.fqon, apiId, payload, onSuccess);
  }

  render() {
    const { onSubmit, apis, implementationId, implementationType, portMappings, formValues, apiEndpointPending } = this.props;

    const steps = [
      {
        label: 'Select an API',
        component: <APIForm
          onSubmit={this.nextPage}
          cancel={this.props.hideModal}
          apis={apis}
          implementationId={implementationId}
          implementationType={implementationType}
        />,
      },
      {
        label: 'Define the Endpoint',
        component: <APIEndpointForm
          onSubmit={this.finish}
          cancel={this.props.hideModal}
          previousPage={this.previousPage}
          implementationId={implementationId}
          implementationType={implementationType}
          formValues={formValues}
          portMappings={portMappings}
          pending={apiEndpointPending}
        />
      },
    ];

    return (
      <DialogContainer
        id="context-form-dialog"
        title="Map API Endpoint"
        visible={this.props.modal.visible}
        onHide={this.props.hideModal}
        width="60em"
        actions={null}
        defaultVisibleTransitionable
        modal
      >
        <Row gutter={5}>
          <Col flex={12} xs={12}>
            <Stepper
              steps={steps}
              onSubmit={onSubmit}
              activeStep={this.state.step}
            />
          </Col>
        </Row>
      </DialogContainer>
    );
  }
}

const selector = form => formValueSelector(form);
const mapStateToProps = state => ({
  modal: state.modal,
  formValues: selector('APIEndpointMappingWizard')(state,
    'properties.plugins',
    'properties.synchronous',
  ),
});

const actions = dispatch => ({
  hideModal: () => {
    dispatch({ type: 'HIDE_MODAL' });
  },
  destroyForm: (form) => {
    dispatch(destroy(form));
  }
});

export default compose(
  withMetaResource,
  connect(mapStateToProps, actions),
)(APIEndpointWizard);

