import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { object, string } from 'yup';
import axios from 'axios';
import { API_TIMEOUT } from '../../../constants';

const upgradeSchema = object({
  image: string().required(),
  dbProviderId: string().required(),
  secProviderId: string().email(),
  caasProviderId: string().url(),
  kongProviderId: string(),
});

const { Provider, Consumer } = React.createContext();

const upgradeInstanceAPI = axios.create({
  timeout: API_TIMEOUT,
});


class UpgradeProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
  };

  state = {
    upgrade: {
      active: false,
    },
    loading: false,
    getStatus: () => this.getStatus(),
    launchUpgrade: payload => this.launchUpgrade(payload),
    deleteUpgrade: () => this.deleteUpgrade(),
    recomputeUpgrade: () => this.recomputeUpgrade(),
  }

  componentDidMount() {
    this.getStatus();
  }

  getStatus = async () => {
    this.setState({ loading: true });
    const response = await axios.get('upgrade');
    this.setState({ upgrade: response.data, loading: false });
  }

  launchUpgrade = async (payload) => {
    await upgradeSchema.isValid(payload);
    this.setState({ loading: true });

    try {
      const response = await axios.post('upgrade', payload);
      this.setState({ upgrade: response.data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  deleteUpgrade = async () => {
    this.setState({ loading: true });

    try {
      const response = await axios.delete('upgrade');
      this.setState({ upgrade: response.data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  recomputeUpgrade = async (endpoint) => {
    this.setState({ loading: true });

    try {
      const response = await upgradeInstanceAPI.post(`${endpoint}/plan`);
      this.setState({ instance: response.data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  render() {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    );
  }
}

export { Consumer, Provider };
export default UpgradeProvider;
