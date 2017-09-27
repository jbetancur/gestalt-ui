import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import { ModalTitle } from 'components/Modal';
import HealthCheckForm from '../../components/HealthCheckForm';
import actions from '../../actions';
import validate from '../../components/HealthCheckForm/validations';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    width: 100%;
    max-width: 45em;
    .md-dialog-content {
      min-height: 10em;
      overflow: visible;
    }
  }
`;

class HealthCheckModal extends PureComponent {
  static propTypes = {
    addHealthCheck: PropTypes.func.isRequired,
    hideHealthCheckModal: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    healthCheckModal: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }

  addHealthCheck(values) {
    this.props.addHealthCheck(values);
    this.props.hideHealthCheckModal();
    this.props.reset();
  }

  render() {
    return (
      <EnhancedDialog
        id="health-check-modal"
        position="below"
        visible={this.props.healthCheckModal.visible}
        title={<ModalTitle title="Add Health Check" icon="mood" />}
        modal={false}
        closeOnEsc
        autosizeContent={false}
        onHide={() => this.props.hideHealthCheckModal()}
      >
        <HealthCheckForm onSubmit={values => this.addHealthCheck(values)} {...this.props} />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    healthCheckModal: state.healthCheckModal.healthCheckModal,
    initialValues: {
      protocol: 'HTTP',
      grace_period_seconds: 300,
      interval_seconds: 60,
      timeout_seconds: 20,
      max_consecutive_failures: 3,
      port_type: 'number' // this is stripped off when submitted
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'healthCheckCreate',
  validate,
})(HealthCheckModal));
