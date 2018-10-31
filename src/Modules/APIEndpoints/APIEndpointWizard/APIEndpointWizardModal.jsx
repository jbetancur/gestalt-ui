import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { DialogContainer } from 'react-md';
import { Stepper } from 'components/Form';
import { generateContextEntityState } from 'util/helpers/context';
import { generatePayload } from '../payloadTransformer';
import APIPage from './APIPage';
import APIEndpointPage from './APIEndpointPage';
import page1Validations from './page1Validations';
import page2Validations from './page2Validations';
import apiEndpointModel from '../models/apiEndpoint';
import withAPIEndpoint from '../hocs/withAPIEndpoint';
import withAPIEndpoints from '../hocs/withAPIEndpoints';
import withAPIs from '../../APIs/hocs/withAPIs';

const initialValues = apiEndpointModel.get();

class APIEndpointWizard extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    apisActions: PropTypes.object.isRequired,
    apiEndpointActions: PropTypes.object.isRequired,
    apiEndpointsActions: PropTypes.object.isRequired,
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
    const entity = generateContextEntityState(params);

    apisActions.fetchAPIs({ fqon: params.fqon, entityId: entity.id, entityKey: entity.key });
  }

  componentWillUnmount() {
    this.props.apisActions.unloadAPIs();
  }

  nextPage = () => {
    this.setState(prevState => ({ step: prevState.step + 1 }));
  }

  previousPage = () => {
    if (this.state.step > 0) {
      this.setState(prevState => ({ step: prevState.step - 1 }));
    }
  }

  finish = (values) => {
    const { apiId } = values;
    const { apiEndpointActions, apiEndpointsActions, implementationType, implementationId, params, hideModal } = this.props;

    const model = {
      name: `${implementationId}-${values.properties.resource}`,
      properties: {
        ...values.properties,
        implementation_type: implementationType,
        implementation_id: implementationId,
      }
    };

    const payload = generatePayload(model);
    const onSuccess = () => {
      apiEndpointsActions.fetchAPIEndpoints({ fqon: params.fqon, params: { implementation_type: implementationType, implementation_id: implementationId } });
      hideModal();
    };

    apiEndpointActions.createAPIEndpoint({ fqon: params.fqon, entityId: apiId, entityKey: 'apis', payload, onSuccess });
  }

  render() {
    const { visible, apis, implementationId, implementationType, portMappings, apiEndpointPending, hideModal } = this.props;

    return (
      <DialogContainer
        id="context-form-dialog"
        title="Map API Endpoint"
        visible={visible}
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
  withAPIEndpoint(),
  withAPIEndpoints({ unload: false }),
  withAPIs,
  connect(mapStateToProps, actions),
)(APIEndpointWizard);
