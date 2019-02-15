import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Stepper } from 'components/Form';
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
    // modal props
    modal: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired,
    implementationId: PropTypes.string.isRequired,
    implementationType: PropTypes.string.isRequired,
    portMappings: PropTypes.array,
    // Internal props
    apisActions: PropTypes.object.isRequired,
    apiEndpointActions: PropTypes.object.isRequired,
    apiEndpointsActions: PropTypes.object.isRequired,
    apiEndpointPending: PropTypes.bool.isRequired,
    apis: PropTypes.array.isRequired,
  };

  static defaultProps = {
    portMappings: [],
  };

  componentDidMount() {
    const { fqon, environmentId, apisActions } = this.props;

    apisActions.fetchAPIs({ fqon, entityId: environmentId, entityKey: 'environments' });
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
    const { modal, fqon, apiEndpointActions, apiEndpointsActions, implementationType, implementationId } = this.props;

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
      apiEndpointsActions.fetchAPIEndpoints({ fqon, params: { implementation_type: implementationType, implementation_id: implementationId } });
      modal.hideModal();
    };

    apiEndpointActions.createAPIEndpoint({ fqon, entityId: apiId, entityKey: 'apis', payload, onSuccess });
  }

  render() {
    const { modal, apis, implementationId, implementationType, portMappings, apiEndpointPending } = this.props;

    return (
      <Dialog
        id="apiendpoint-modal"
        aria-labelledby="capiendpoint-title"
        aria-describedby="apiendpoint-description"
        open={modal.open}
        onClose={modal.hideModal}
        onExited={modal.destroyModal}
        maxWidth="md"
      >
        <DialogTitle id="apiendpoint-title">Map an API Endpoint</DialogTitle>
        <DialogContent>
          <Stepper
            initialValues={initialValues}
            onFinish={this.finish}
            onCancel={modal.hideModal}
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
        </DialogContent>
      </Dialog>
    );
  }
}

export default compose(
  withAPIEndpoint(),
  withAPIEndpoints({ unload: false }),
  withAPIs,
)(APIEndpointWizard);
