import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { isEqual } from 'lodash';

const EnhancedSnackBar = styled(SnackbarContent)`
  max-width: 100%;
  width: 100%;
  background-color: ${props => props.theme.colors.error};
  font-size: 14px;
`;

class ErrorNotifications extends PureComponent {
  static propTypes = {
    error: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      toasts: [],
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
          open: true,
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
            open: true,
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

  handleClose = index => () => {
    this.setState((state) => {
      const newToasts = state.toasts.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            open: false,
          };
        }

        return item;
      });

      return { toasts: newToasts };
    });
  }

  render() {
    return (
      this.state.toasts.map((snack, index) => (
        <Snackbar
          key={index}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snack.open}
          autoHideDuration={8000}
          onClose={this.handleClose(index)}
          onExited={this.removeToast}
        >
          <EnhancedSnackBar
            message={snack.text}
            action={[
              <IconButton
                key="close"
                aria-label={snack.action}
                color="inherit"
                onClick={this.handleClose(index)}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </Snackbar>
      ))
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
