import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import { FontIcon } from 'react-md';
import { Button } from 'components/Buttons';

const icons = {
  error: {
    icon: 'error',
  },
  warning: {
    icon: 'warning',
  },
  info: {
    icon: 'info',
  },
  success: {
    icon: 'check_circle',
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

const Icon = styled(FontIcon)`
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
          {message.icon && message.status && <Icon>{icons[message.status].icon}</Icon>}
          {message.message}
        </Text>

        {onRemove &&
          <Action>
            <Button id={`close-${message.id}`} icon onClick={this.onRemove}>close</Button>
          </Action>}
      </AlertBody>
    );
  }
}

export default withTheme(NotificationContent);
