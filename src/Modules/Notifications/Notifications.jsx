import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import NotificationContent from './NotificationContent';
import actions from './actions';

const MessageGroup = styled.div`
  position: fixed;
  bottom: 52px;
  left: 64px;
  z-index: 999;
  display: flex;
  align-items: center;
  pointer-events: none;

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-active {
    opacity: 1;
    transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit-active {
    opacity: 0;
    transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
`;

export class Notifications extends PureComponent {
  static propTypes = {
    removeNotification: PropTypes.func.isRequired,
    queue: PropTypes.array.isRequired,
  };

  render() {
    const { queue, removeNotification } = this.props;

    return (
      <MessageGroup>
        <TransitionGroup>
          {queue.map(message => (
            <CSSTransition
              key={message.id}
              timeout={200}
              classNames="fade"
            >
              <NotificationContent
                message={message}
                onRemove={removeNotification}
              />
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

export default connect(mapStateToProps, actions)(Notifications);
