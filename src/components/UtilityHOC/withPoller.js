import React from 'react';
import PropTypes from 'prop-types';

const asyncPoll = (intervalDuration = 60 * 1000, onInterval) => (
  Component => class extends React.Component {
    static propTypes = {
      dispatch: PropTypes.func,
    };

    static defaultProps = {
      dispatch: null,
    };

    componentDidMount() {
      this.startPolling();
    }

    componentWillUnmount() {
      this.stopPolling();
    }

    getProps() {
      return {
        ...this.props,
        startPolling: this.startPolling,
        stopPolling: this.stopPolling,
        isPolling: Boolean(this.interval),
      };
    }

    startPolling = () => {
      if (this.interval) return;
      this.keepPolling = true;
      this.asyncInterval(intervalDuration, onInterval);
    }

    stopPolling = () => {
      this.keepPolling = false;
      if (this.interval) clearTimeout(this.interval);
      this.interval = undefined;
    }

    asyncInterval(duration, fn) {
      const promise = fn(this.getProps(), this.props.dispatch);
      const asyncTimeout = () => setTimeout(() => {
        this.asyncInterval(duration, fn);
      }, duration);
      const assignNextInterval = () => {
        if (!this.keepPolling) {
          this.stopPolling();

          return;
        }
        this.interval = asyncTimeout();
      };

      Promise.resolve(promise)
        .then(assignNextInterval)
        .catch(assignNextInterval);
    }

    render() {
      const props = this.getProps();
      return <Component {...props} />;
    }
  });

export default asyncPoll;
