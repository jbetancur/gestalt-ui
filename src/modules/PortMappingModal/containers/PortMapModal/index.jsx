import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import { ModalTitle } from 'components/Modal';
import PortMapForm from '../../components/PortMapForm';
import * as actions from '../../actions';
import validate from '../../components/PortMapForm/validations';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    width: 100%;
    max-width: 30em;
    .md-dialog-content {
      min-height: 15em;
    }
  }
`;

class PortMapModel extends PureComponent {
  static propTypes = {
    addPortmapping: PropTypes.func.isRequired,
    hidePortmapModal: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    portmapModal: PropTypes.object.isRequired,
    networkType: PropTypes.string,
  };

  static defaultProps = {
    networkType: 'HOST'
  }

  constructor(props) {
    super(props);
  }

  addPortmapping(values) {
    const payload = { ...values };

    if (values.virtual_hosts && values.expose_endpoint) {
      let hosts = values.virtual_hosts;
      hosts = hosts.replace(/[\s,]+/g, ',');

      payload.virtual_hosts = hosts.split(',');
    } else {
      delete payload.virtual_hosts;
    }

    this.props.addPortmapping(payload);
    this.props.hidePortmapModal();
    this.props.reset();
  }

  render() {
    return (
      <EnhancedDialog
        id="portmap-modal"
        position="below"
        visible={this.props.portmapModal.visible}
        title={<ModalTitle title="Add Port Mapping" icon="settings_ethernet" />}
        modal={false}
        closeOnEsc
        onHide={() => this.props.hidePortmapModal()}
      >
        <PortMapForm networkType={this.props.networkType} onSubmit={values => this.addPortmapping(values)} {...this.props} />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    portmapModal: state.portmapModal.portmapModal,
    initialValues: {
      protocol: 'tcp'
    },
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'networkCreate',
  validate,
})(PortMapModel));
