import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import { withPickerData } from 'Modules/MetaResource';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'components/Buttons';
import { ActivityContainer } from 'components/ProgressIndicators';
import ContainerImportForm from '../components/ContainerImportForm';
import withContainer from '../hocs/withContainer';

const initialValues = {
  name: null,
  properties: {
    image: 'n/a',
    container_type: 'n/a',
    external_id: null,
    provider: {
      id: null,
    }
  }
};

class ContainerImportFormModal extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired,
    providersData: PropTypes.array.isRequired,
    containerActions: PropTypes.object.isRequired,
    containerImportPending: PropTypes.bool.isRequired,
  };

  import = (values) => {
    const { modal, containerActions, fqon, environmentId } = this.props;
    const onSuccess = () => modal.hideModal();

    containerActions.importContainer({
      fqon, entityId: environmentId, entityKey: 'environments', payload: values, params: { action: 'import' }, onSuccess
    });
  }

  render() {
    const { modal, title, containerImportPending, providersData } = this.props;

    return (
      <Dialog
        id="container-import-modal"
        aria-labelledby="container-import-title"
        aria-describedby="container-import-description"
        open={modal.open}
        onClose={modal.hideModal}
        onExited={modal.destroyModal}
        maxWidth="sm"
      >
        <DialogTitle id="container-import-title">{title}</DialogTitle>
        {containerImportPending && <ActivityContainer primary centered id="container-import--loading" />}
        <DialogContent>
          <Form
            initialValues={initialValues}
            render={ContainerImportForm}
            onSubmit={this.import}
            providers={providersData}
            pending={containerImportPending}
          />
        </DialogContent>
        <DialogActions>
          <Button
            flat
            onClick={modal.hideModal}
            disabled={containerImportPending}
          >
            Cancel
          </Button>
          <Button
            key="container--import"
            primary
            flat
            onClick={() => document.getElementById('import-container-modal').dispatchEvent(new Event('submit', { cancelable: true }))}
            disabled={containerImportPending}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose(
  withContainer({ unload: false }),
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
)(ContainerImportFormModal);
