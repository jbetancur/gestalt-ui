import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Snackbar from 'react-md/lib/Snackbars';

const EnhancedSnackBar = styled(Snackbar)`
  z-index: 9999;
  min-height: 5em;
  button {
    color: red;
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
          action: 'Close'
        };

        toasts.push(errorPayload);
        this.setState({ toasts });
      }

      // deal with errors when an object as well as phantom data: {}
      if (error.data && Object.keys(error.data).length > 0) {
        const errorPayload = {
          text: `${friendlyMessage} ${statusCode} ${message}`,
          action: 'Close'
        };

        toasts.push(errorPayload);
        this.setState({ toasts });
      }
    }
  }

  removeToast() {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }

  render() {
    return (
      <div className="btn-group">
        <EnhancedSnackBar
          {...this.state}
          onDismiss={() => this.removeToast()}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.error
  };
}

export default connect(mapStateToProps)(ErrorNotifications);

