import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { merge, flatten } from 'lodash';
import { withRouter } from 'react-router-dom';
import { generateContextEntityState } from 'util/helpers/context';
import { buildAllURL } from '../lib/urlmapper';

export default ({ fetchOnMount = true } = {}) => (WrapperComponent) => {
  class ProviderKongsByGateway extends Component {
    static displayName = 'ProviderKongsByGateway (HOC)';

    static propTypes = {
      match: PropTypes.object.isRequired,
    };

    state = {
      providerKongsByGatewayData: [],
      providerKongsByGatewayLoading: false,
      providerKongsByGatewayError: {},
    };

    componentDidMount() {
      this.$isMounted = true;

      if (fetchOnMount) {
        this.get();
      }
    }

    componentWillUnmount() {
      this.$isMounted = false;
    }

    fetchProviderKongsByGateway = () => {
      this.get();
    }

    async get() {
      const { match } = this.props;

      if (this.$isMounted) this.setState({ providerKongsByGatewayLoading: true });

      try {
        const entityParams = generateContextEntityState(match.params);
        const gwmURL = buildAllURL('providers', { fqon: match.params.fqon, entityId: entityParams.id, entityKey: entityParams.key, params: { expand: true, type: 'GatewayManager' } });
        const kongURL = buildAllURL('providers', { fqon: match.params.fqon, entityId: entityParams.id, entityKey: entityParams.key, params: { expand: true, type: 'Kong' } });
        const responseGWs = await axios.get(gwmURL);
        const responseKongs = await axios.get(kongURL);
        const gatewayProviders = responseKongs.data.map(kong => responseGWs.data.map(gw => gw.properties.linked_providers.find(lp => lp.id === kong.id) && gw));
        const response = responseKongs.data.map(provider => merge(provider, { properties: { gatewayProvider: flatten(gatewayProviders)[0] } }));

        const providerKongsByGatewayData = response.length ? response : [{ id: '', name: 'No Available Providers' }];
        if (this.$isMounted) this.setState({ providerKongsByGatewayData, providerKongsByGatewayLoading: false });
      } catch (error) {
        if (this.$isMounted) this.setState({ c: false, error });
      } finally {
        if (this.$isMounted) this.setState({ providerKongsByGatewayLoading: false });
      }
    }

    render() {
      return (
        <WrapperComponent
          {...this.fetchProviderKongsByGateways}
          {...this.state}
          {...this.props}
        />
      );
    }
  }

  return withRouter(ProviderKongsByGateway);
};
