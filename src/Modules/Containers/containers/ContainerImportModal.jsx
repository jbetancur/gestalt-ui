import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { DialogContainer } from 'react-md';
import { Form } from 'react-final-form';
import { Button } from 'components/Buttons';
import { ActivityContainer } from 'components/ProgressIndicators';
import ContainerImportForm from './ContainerImportForm';
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
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    hideModal: PropTypes.func.isRequired,
    providersData: PropTypes.array.isRequired,
    containerActions: PropTypes.object.isRequired,
    containerImportPending: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
  };

  import = (values) => {
    const { containerActions, match } = this.props;
    const onSuccess = () => this.props.hideModal();

    containerActions.importContainer({
      fqon: match.params.fqon, entityId: match.params.environmentId, entityKey: 'environments', payload: values, params: { action: 'import' }, onSuccess
    });
  }

  render() {
    const { visible, title, hideModal, containerImportPending, providersData } = this.props;

    return (
      <DialogContainer
        id="context-form-dialog"
        title={title}
        visible={visible}
        onHide={hideModal}
        actions={
          <React.Fragment>
            <Button
              flat
              onClick={hideModal}
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
          </React.Fragment>
        }
        defaultVisibleTransitionable
        modal
        initialFocus="div"
        width="40em"
      >
        {containerImportPending && <ActivityContainer primary centered id="container-imports--loading" />}
        <Form
          initialValues={initialValues}
          render={ContainerImportForm}
          onSubmit={this.import}
          providers={providersData}
          pending={containerImportPending}
        />
      </DialogContainer>
    );
  }
}

const actions = dispatch => ({
  hideModal: () => {
    dispatch({ type: 'HIDE_MODAL' });
  },
});

export default compose(
  connect(null, actions),
  withContainer({ unload: false }),
)(ContainerImportFormModal);
