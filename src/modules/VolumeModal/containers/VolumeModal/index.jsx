import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import { ModalTitle } from 'components/Modal';
import VolumeForm from '../../components/VolumeForm';
import actions from '../../actions';
import validate from '../../components/VolumeForm/validations';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    width: 100%;
    max-width: 48em;
    .md-dialog-content {
      min-height: 10em;
      overflow: visible;
    }
  }
`;

class VolumeModal extends PureComponent {
  static propTypes = {
    addVolume: PropTypes.func.isRequired,
    hideVolumeModal: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    volumeModal: PropTypes.object.isRequired,
    providerType: PropTypes.string,
  };

  static defaultProps = {
    providerType: '',
  };

  constructor(props) {
    super(props);
  }

  addVolume(values) {
    this.props.addVolume(values);
    this.props.hideVolumeModal();
    this.props.reset();
  }

  render() {
    return (
      <EnhancedDialog
        id="volume-modal"
        position="below"
        visible={this.props.volumeModal.visible}
        title={<ModalTitle title="Add Volume" icon="storage" />}
        modal={false}
        closeOnEsc
        onHide={() => this.props.hideVolumeModal()}
      >
        <VolumeForm
          onSubmit={values => this.addVolume(values)}
          providerType={this.props.providerType}
          {...this.props}
        />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    volumeModal: state.volumeModal.volumeModal,
    initialValues: {
      type: 'persistent',
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'volumeCreate',
  validate,
})(VolumeModal));
