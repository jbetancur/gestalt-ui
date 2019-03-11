import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { IconButton } from 'components/Buttons';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const icons = {
  error: {
    icon: <ErrorIcon fontSize="small" color="inherit" />,
  },
  warning: {
    icon: <WarningIcon fontSize="small" color="inherit" />,
  },
  info: {
    icon: <InfoIcon fontSize="small" color="inherit" />,
  },
  success: {
    icon: <CheckCircleIcon fontSize="small" color="inherit" />,
  },
};

const raisedEffect = css`
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
`;

const AlertBody = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 1;
  margin: 8px;
  background-color: ${props => (props.status ? props.theme.colors[props.status] : 'rgb(49, 49, 49)')};
  width: ${props => props.width};
  min-height: 48px;
  border-radius: 3px;
  padding: 6px 16px;
  pointer-events: initial;
  opacity: 0.98;
  ${props => props.raised && raisedEffect};
`;

const IconWrapper = styled.div`
  padding-right: 8px;

  svg,
  i {
    color: white !important;
  }
`;

const Text = styled.div`
  color: white;
  display: flex;
  align-items: center;
  flex: 1 0 264px;

  svg,
  i {
    color: white !important;
  }
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  color: white;
  justify-content: flex-end;

  button {
    svg,
    i {
      color: white !important;
    }
  }
`;

class NotificationContent extends PureComponent {
  static propTypes = {
    onRemove: PropTypes.func,
    raised: PropTypes.bool,
    width: PropTypes.string,
    message: PropTypes.shape({
      message: PropTypes.string,
      icon: PropTypes.bool,
      status: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    }).isRequired,
  };

  static defaultProps = {
    onRemove: null,
    raised: false,
    width: '344px',
  };

  onRemove = () => {
    const { message, onRemove } = this.props;

    if (onRemove) {
      onRemove(message);
    }
  }

  render() {
    const { message, onRemove, raised, width } = this.props;

    return (
      <AlertBody status={message.status} raised={raised} width={width}>
        <Text>
          {message.icon && message.status && (
            <IconWrapper>
              {icons[message.status].icon}
            </IconWrapper>
          )}
          {message.message}
        </Text>

        {onRemove &&
          <Action>
            <IconButton
              id={`close-${message.id}`}
              icon={<CloseIcon fontSize="small" />}
              onClick={this.onRemove}
            />
          </Action>}
      </AlertBody>
    );
  }
}

export default NotificationContent;
