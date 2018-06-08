import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withContainer } from 'Modules/MetaResource';
import { DialogContainer } from 'react-md';
import { Form } from 'react-final-form';
import { Button } from 'components/Buttons';
import { ActivityContainer } from 'components/ProgressIndicators';
import ContainerImportForm from './ContainerImportForm';

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
    title: PropTypes.string.isRequired,
    modal: PropTypes.object.isRequired,
    hideModal: PropTypes.func.isRequired,
    providersData: PropTypes.array.isRequired,
    containerActions: PropTypes.object.isRequired,
    containerImportPending: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
  };

  import = (values) => {
    const { containerActions, match } = this.props;

    containerActions.importContainer({ fqon: match.params.fqon, entityId: match.params.environmentId, entityKey: 'environments', payload: values, params: { action: 'import' } });
  }

  render() {
    return (
      <DialogContainer
        id="context-form-dialog"
        title={this.props.title}
        visible={this.props.modal.visible}
        onHide={this.props.hideModal}
        actions={
          <React.Fragment>
            <Button
              flat
              onClick={this.props.hideModal}
              disabled={this.props.containerImportPending}
            >
              Cancel
            </Button>
            <Button
              key="container--import"
              primary
              flat
              onClick={() => document.getElementById('import-container-modal').dispatchEvent(new Event('submit'))}
              disabled={this.props.containerImportPending}
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
        {this.props.containerImportPending && <ActivityContainer primary centered id="container-imports--loading" />}
        <Form
          initialValues={initialValues}
          render={ContainerImportForm}
          onSubmit={this.import}
          providers={this.props.providersData}
          pending={this.props.containerImportPending}
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

const mapStateToProps = state => ({
  modal: state.modal,
});


export default compose(
  connect(mapStateToProps, actions),
  withContainer({ unload: false }),
)(ContainerImportFormModal);
