import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { object, string } from 'yup';
import queryString from 'query-string';
import axios from 'axios';
import { API_TIMEOUT } from '../../constants';

const upgradeSchema = object({
  image: string().required(),
  dbProviderId: string().required(),
  secProviderId: string().required(),
  caasProviderId: string().required(),
  kongProviderId: string().required(),
  gwmProviderId: string().required(),
});

const upgradeInstanceAPI = axios.create({
  timeout: API_TIMEOUT,
});

const determineError = (error) => {
  if (error && error.response && error.response.data) {
    return error.response.data.message;
  }

  if (error && typeof error === 'object') {
    return error.message;
  }

  return error;
};

const buildParams = (baseURL, params) => (params ? `${baseURL}?${queryString.stringify(params)}` : baseURL);

export default function withUpgrader(BaseComponent) {
  class UpgradeAPI extends Component {
    static displayName = 'UpgradeAPI (HOC)';

    state = {
      upgrade: {
        active: false,
      },
      plan: [],
      log: [],
      status: {},
      loading: false,
      init: false,
      error: null,
    }

    componentDidMount() {
      this.getStatus();
    }

    componentWillUnmount() {
      this.clearAllPolling();
    }

    getStatus = async () => {
      this.setState({ loading: true, error: null });

      try {
        const response = await axios.get('upgrade');
        this.setState({ upgrade: response.data, loading: false, init: true });
      } catch (error) {
        this.setState({ error: determineError(error), loading: false });
      }
    }

    getUpgraderStatus = async () => {
      this.setState({ loading: true, error: null });

      try {
        const response = await upgradeInstanceAPI.get(`${this.state.upgrade.endpoint}/status`);

        this.setState({ status: response.data, loading: false });
      } catch (error) {
        this.setState({ error: determineError(error), loading: false });
      }
    }

    getPlan = async () => {
      this.setState({ loading: true, error: null });

      try {
        const response = await upgradeInstanceAPI.get(`${this.state.upgrade.endpoint}/plan`);

        this.setState({ plan: response.data, loading: false });
      } catch (error) {
        this.setState({ error: determineError(error), loading: false });
      }
    }

    getUpgraderLog = async () => {
      this.setState({ loading: true, error: null, log: [], });

      try {
        const response = await upgradeInstanceAPI.get(`${this.state.upgrade.endpoint}/log`);
        this.setState({ loading: false, log: response.data });
      } catch (error) {
        this.setState({ error: determineError(error), loading: false });
      }
    }

    clearAllPolling() {
      clearInterval(this.timeoutPollUpgraderStatus);
      clearInterval(this.timeoutPollPlan);
      clearInterval(this.timeoutPollLog);
    }

    clearPollLog() {
      clearInterval(this.timeoutPollLog);
    }

    launchUpgrade = async (payload) => {
      this.setState({ loading: true, error: null, });

      try {
        await upgradeSchema.validate(payload);
        const response = await axios.post('upgrade', payload);
        this.setState({ upgrade: response.data, loading: false, error: null });
      } catch (error) {
        this.setState({ error: determineError(error), loading: false });
      }
    }

    deleteUpgrade = async () => {
      this.setState({ loading: true, error: null });

      try {
        const response = await axios.delete('upgrade');
        this.clearAllPolling();
        this.setState({ upgrade: response.data, loading: false, plan: [], status: {} });
      } catch (error) {
        this.setState({ error: determineError(error), loading: false });
      }
    }

    pollInitUpgraderStatus = () => {
      clearInterval(this.timeoutPollUpgraderStatus);
      this.setState({ error: null, loading: true });

      return new Promise((resolve, reject) => {
        try {
          this.timeoutPollUpgraderStatus = setInterval(async () => {
            const response = await upgradeInstanceAPI.get(`${this.state.upgrade.endpoint}/status`);

            if (response.status === 200) {
              clearInterval(this.timeoutPollUpgraderStatus);
              this.setState({ status: response.data, loading: false });
              resolve(response.data);
            }
          }, 5000);
        } catch (error) {
          reject(error);
        }
      });
    }

    pollUpgraderStatus = () => {
      clearInterval(this.timeoutPollUpgraderStatus);
      this.setState({ error: null, loading: true });

      return new Promise((resolve, reject) => {
        try {
          this.timeoutPollUpgraderStatus = setInterval(async () => {
            const response = await upgradeInstanceAPI.get(`${this.state.upgrade.endpoint}/status`);

            if (response.data) {
              if (response.data.isComplete) {
                clearInterval(this.timeoutPollUpgraderStatus);
              }

              if (response.data.isFailed) {
                clearInterval(this.timeoutPollUpgraderStatus);
                throw new Error('Upgrader Failed');
              }

              this.setState({ status: response.data, loading: false });
              resolve(response.data);
            }
          }, 5000);
        } catch (error) {
          clearInterval(this.timeoutPollUpgraderStatus);
          reject(error);
        }
      });
    }

    pollPlan = async () => {
      clearInterval(this.timeoutPollPlan);
      this.setState({ error: null, loading: true });

      return new Promise((resolve, reject) => {
        try {
          this.timeoutPollPlan = setInterval(async () => {
            const response = await upgradeInstanceAPI.get(`${this.state.upgrade.endpoint}/plan`);
            clearInterval(this.timeoutPollPlan);
            this.setState({ plan: response.data, loading: false });
            resolve(response.data);
          }, 5000);
        } catch (error) {
          clearInterval(this.timeoutPollPlan);
          reject(error);
        }
      });
    }

    pollUpgraderLog = async (params) => {
      clearInterval(this.timeoutPollLog);
      this.setState({ error: null });

      return new Promise((resolve, reject) => {
        try {
          this.timeoutPollLog = setInterval(async () => {
            const url = buildParams(`${this.state.upgrade.endpoint}/log`, params);
            const response = await upgradeInstanceAPI.get(url);
            this.setState({ log: response.data });
            resolve(response.data);
          }, 5000);
        } catch (error) {
          clearInterval(this.timeoutPollLog);
          reject(error);
        }
      });
    }

    recomputePlan = async () => {
      this.setState({ loading: true, error: null, plan: [], });

      try {
        await upgradeInstanceAPI.post(`${this.state.upgrade.endpoint}/plan`);
        this.setState({ loading: false });
      } catch (error) {
        this.setState({ error: determineError(error), loading: false });
      }
    }

    upgraderInstance = async (action, params) => {
      this.setState({ loading: true, error: null });

      try {
        const url = buildParams(`${this.state.upgrade.endpoint}/${action}`, params);
        upgradeInstanceAPI.post(url);
        this.setState({ loading: false });
      } catch (error) {
        this.setState({ error: determineError(error), loading: false });
      }
    }

    render() {
      return (
        <BaseComponent
          getStatus={this.getStatus}
          launchUpgrade={this.launchUpgrade}
          deleteUpgrade={this.deleteUpgrade}
          getPlan={this.getPlan}
          getUpgraderStatus={this.getUpgraderStatus}
          recomputePlan={this.recomputePlan}
          upgraderInstance={this.upgraderInstance}
          pollInitUpgraderStatus={this.pollInitUpgraderStatus}
          pollUpgraderStatus={this.pollUpgraderStatus}
          pollPlan={this.pollPlan}
          getUpgraderLog={this.getUpgraderLog}
          pollUpgraderLog={this.pollUpgraderLog}
          clearAllPolling={this.clearAllPolling}
          clearPollLog={this.clearPollLog}
          {...this.state}
          {...this.props}
        />
      );
    }
  }


  return UpgradeAPI;
}
