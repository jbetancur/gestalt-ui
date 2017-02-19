import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import { ModalTitle } from 'components/Modal';
import NetworkForm from '../../components/NetworkForm';
import * as actions from '../../actions';
import validate from '../../components/NetworkForm/validations';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    width: 100%;
    max-width: 30em;
    .md-dialog-content {
      min-height: 14em;
    }
  }
`;

class NetworkModal extends PureComponent {
  static propTypes = {
    addNetwork: PropTypes.func.isRequired,
    hideNetworkModal: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    networkModal: PropTypes.object.isRequired,
    networkType: PropTypes.string,
  };

  static defaultProps = {
    networkType: 'HOST'
  }

  constructor(props) {
    super(props);
  }

  addNetwork(values) {
    this.props.addNetwork(values);
    this.props.hideNetworkModal();
    this.props.reset();
  }

  render() {
    return (
      <EnhancedDialog
        id="network-modal"
        position="below"
        visible={this.props.networkModal.visible}
        title={<ModalTitle title="Add Port Mapping" icon="compare_arrows" />}
        modal={false}
        closeOnEsc
        onHide={() => this.props.hideNetworkModal()}
      >
        <NetworkForm networkType={this.props.networkType} onSubmit={values => this.addNetwork(values)} {...this.props} />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    networkModal: state.networkModal.networkModal,
    initialValues: {
      protocol: 'tcp'
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'networkCreate',
  validate,
})(NetworkModal));
