import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Snackbar } from 'react-md';
import { isEqual } from 'lodash';

const EnhancedSnackBar = styled(Snackbar)`
  min-height: 5em;
  max-width: 100%;
  width: 100%;
  overflow: auto;
  padding: 6px;
  background-color: ${props => props.theme.colors.error};
  border-radius: 0;

  button {
    padding-left: 16px;
    padding-right: 16px;
    color: white;
  }
`;

class ErrorNotifications extends PureComponent {
  static propTypes = {
    error: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      toasts: [],
      autohide: true,
      autohideTimeout: 8000,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      // slice to maintain immutability
      const toasts = this.state.toasts.slice();
      const { friendlyMessage, error } = nextProps.error;
      const statusCode = error.status || error;
      const message = (error.data && error.data.message) ? error.data.message : '';

      // deal with errors when a string
      if (typeof error === 'string') {
        const errorPayload = {
          text: error,
          action: 'Close',
        };

        if (!this.checkDupeToasts(errorPayload)) {
          toasts.push(errorPayload);
          this.setState({ toasts });
        }
      }

      // deal with errors when an object as well as phantom data: {}
      if (error.data && Object.keys(error.data).length > 0) {
        // TODO: ignore sync errors for now until meta sync is no longer required
        const isSyncError = error.request && error.request.responseURL && error.request.responseURL.includes('/sync');

        if (!isSyncError) {
          const errorPayload = {
            text: `${friendlyMessage} ${message} ${statusCode && `(code ${statusCode})`}`,
            action: 'Close',
          };

          if (!this.checkDupeToasts(errorPayload)) {
            toasts.push(errorPayload);
            this.setState({ toasts });
          }
        }
      }
    }
  }

  checkDupeToasts(errorPayload) {
    const { toasts } = this.state;

    return isEqual(toasts[toasts.length - 1], errorPayload);
  }

  removeToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }

  render() {
    return (
      <EnhancedSnackBar
        {...this.state}
        onDismiss={this.removeToast}
        portal
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.error
  };
}

export default compose(
  connect(mapStateToProps),
)(ErrorNotifications);
