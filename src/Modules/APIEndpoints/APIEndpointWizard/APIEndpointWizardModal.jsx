import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { DialogContainer } from 'react-md';
import { Stepper } from 'components/Form';
import { withMetaResource, withAPIs, metaModels } from 'Modules/MetaResource';
import { generatePayload } from '../payloadTransformer';
import APIPage from './APIPage';
import APIEndpointPage from './APIEndpointPage';
import page1Validations from './page1Validations';
import page2Validations from './page2Validations';

const initialValues = metaModels.apiEndpoint.create({
  properties: {
    methods: 'GET', // converts to array
    plugins: {
      rateLimit: {
        enabled: false,
        perMinute: 60,
      },
      gestaltSecurity: {
        enabled: false,
        users: [],
        groups: [],
      },
    },
    implementation_type: '',
    implementation_id: '',
    resource: '',
    synchronous: true,
  }
});

class APIEndpointWizard extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    hideModal: PropTypes.func.isRequired,
    apisActions: PropTypes.object.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    createAPIEndpoint: PropTypes.func.isRequired,
    apiEndpointPending: PropTypes.bool.isRequired,
    apis: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    implementationId: PropTypes.string.isRequired,
    implementationType: PropTypes.string.isRequired,
    portMappings: PropTypes.array,
  };

  static defaultProps = {
    portMappings: [],
  };

  componentDidMount() {
    const { params, apisActions } = this.props;

    apisActions.fetchAPIs({ fqon: params.fqon, environmentId: params.environmentId });
  }

  componentWillUnmount() {
    this.props.apisActions.unloadAPIs();
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

    const payload = generatePayload(model);
    const onSuccess = () => {
      fetchAPIEndpoints(params.fqon, implementationId, implementationType);
      hideModal();
    };

    createAPIEndpoint(params.fqon, apiId, payload, onSuccess);
  }

  render() {
    const { apis, implementationId, implementationType, portMappings, apiEndpointPending, hideModal } = this.props;

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
        <Stepper
          initialValues={initialValues}
          onFinish={this.finish}
          onCancel={hideModal}
          pending={apiEndpointPending}
        >
          <Stepper.Page validate={page1Validations} title="Select an API">
            <APIPage
              apis={apis}
            />
          </Stepper.Page>
          <Stepper.Page validate={page2Validations({ implementationType })} title="Define the Endpoint">
            <APIEndpointPage
              implementationId={implementationId}
              implementationType={implementationType}
              portMappings={portMappings}
              pending={apiEndpointPending}
              initialValues={initialValues}
            />
          </Stepper.Page>
        </Stepper>
      </DialogContainer>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal,
});

const actions = dispatch => ({
  hideModal: () => {
    dispatch({ type: 'HIDE_MODAL' });
  },
});

export default compose(
  withMetaResource,
  withAPIs,
  connect(mapStateToProps, actions),
)(APIEndpointWizard);

