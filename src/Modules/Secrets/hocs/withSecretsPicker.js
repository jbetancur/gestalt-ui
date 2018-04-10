import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { urlmapper } from 'Modules/MetaResource';

export default (WrapperComponent) => {
  class SecretPicker extends Component {
    static displayName = 'SecretPicker(HOC)';
    static propTypes = {
      match: PropTypes.object.isRequired,
    };

    state = { secrets: [], isLoading: false };

    componentDidMount() {
      this.getSecrets();
    }

    async getSecrets() {
      const { match } = this.props;
      const urlConfig = { fqon: match.params.fqon, entityId: match.params.environmentId, entityKey: 'environments' };
      const url = urlmapper.buildAllURL('secrets', urlConfig, true);
      this.setState({ isLoading: true });
      const res = await axios.get(url);

      try {
        if (res.data.length) {
          this.setState({ secrets: res.data, isLoading: false });
        } else {
          this.setState({ secrets: [{ id: '', name: 'No Available Secrets' }], isLoading: false });
        }
      } catch (e) {
        this.setState({ secrets: [{ id: '', name: 'No Available Secrets' }], isLoading: false });
      }
    }

    render() {
      return (
        <WrapperComponent
          secrets={this.state.secrets}
          secretsLoading={this.state.isLoading}
          {...this.props}
        />
      );
    }
  }

  return SecretPicker;
};
