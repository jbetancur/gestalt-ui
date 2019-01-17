import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { FontIcon } from 'react-md';
import { Button } from 'components/Buttons';

const colors = {
  error: {
    color: '$md-red-700',
    icon: 'error',
  },
  warning: {
    color: '$md-amber-700',
    icon: 'warning',
  },
  info: {
    color: '$md-blue-700',
    icon: 'info',
  },
  success: {
    color: '$md-green-700',
    icon: 'check_circle',
  },
};

const Message = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 8px;
  background-color: ${props => (props.status ? props.theme.colors[colors[props.status].color] : 'rgb(49, 49, 49)')};
  width: 344px;
  min-height: 48px;
  border-radius: 3px;
  padding: 6px 16px;
  pointer-events: initial;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
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
    onRemove: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired,
  };

  onRemove = () => {
    const { message, onRemove } = this.props;

    onRemove(message);
  }

  render() {
    const { message } = this.props;

    return (
      <Message status={message.status}>
        <Text>
          {message.icon && message.status && <Icon>{colors[message.status].icon}</Icon>}
          {message.message}
        </Text>

        <Action>
          <Button id={`close-${message.id}`} icon onClick={this.onRemove}>close</Button>
        </Action>
      </Message>
    );
  }
}

export default withTheme(NotificationContent);
