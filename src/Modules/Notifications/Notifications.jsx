import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { isEqual } from 'lodash';
import styled, { withTheme } from 'styled-components';
import { FontIcon } from 'react-md';
import { Button } from 'components/Buttons';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import actions from './actions';


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

const MessageGroup = styled.div`
  position: fixed;
  bottom: 64px;
  right: 16px;
  z-index: 999;
  display: flex;
  align-items: center;
  pointer-events: none;

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-out;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit-active {
    opacity: 0;
    transition: opacity 200ms ease-in;
  }
`;

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

export class Notifications extends Component {
  static propTypes = {
    removeNotification: PropTypes.func.isRequired,
    queue: PropTypes.array.isRequired,
    showIcons: PropTypes.bool
  };

  static defaultProps = {
    showIcons: false,
  };

  render() {
    const { queue, removeNotification, showIcons } = this.props;

    return (
      <MessageGroup>
        <TransitionGroup>
          {queue.map(message => (
            <CSSTransition
              key={message.id}
              timeout={200}
              classNames="fade"
            >
              <Message status={message.status}>
                <Text>
                  {showIcons && message.status && <Icon>{colors[message.status].icon}</Icon>}
                  {message.message}
                </Text>

                <Action>
                  <Button icon onClick={() => removeNotification(message)}>close</Button>
                </Action>
              </Message>
            </CSSTransition>
            ))}
        </TransitionGroup>
      </MessageGroup>
    );
  }
}

const mapStateToProps = state => ({
  queue: state.notifications.queue,
});

export default connect(mapStateToProps, actions)(withTheme(Notifications));
