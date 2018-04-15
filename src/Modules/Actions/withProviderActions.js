import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { generateContextEntityState } from 'util/helpers/context';
import { urlmapper } from 'Modules/MetaResource';

const setPropName = asContext => (asContext ? 'contextProviderActions' : 'providerActions');

export default ({ asContext, fetchOnMount = true, filters, params = {} }) => (WrapperComponent) => {
  class ProviderActions extends Component {
    static displayName = 'ProviderActions(HOC)';
    static propTypes = {
      match: PropTypes.object.isRequired,
    };

    constructor(props) {
      super(props);
      const name = setPropName(asContext);

      this.state = {
        [`${name}`]: [],
        [`${name}Loading`]: false,
        [`${name}Error`]: {},
      };

      this.onFetch = { [`fetch${name}Data`]: this.manualFetch, [`${name}Data`]: [] };
    }

    componentDidMount() {
      if (fetchOnMount) {
        this.get();
      }
    }

    manualFetch = () => {
      this.get();
    }

    async get() {
      const { match } = this.props;
      const name = setPropName(asContext);
      const entityParams = generateContextEntityState(match.params);
      const queryParams = Object.assign(params, { expand: true, compact: false, filters });
      const url = urlmapper.buildAllURL('actions', { fqon: match.params.fqon, entityId: entityParams.id, entityKey: entityParams.key, params: queryParams }, true);

      this.setState({ [`${name}Loading`]: true });

      try {
        const res = await axios.get(url);
        this.setState({ [`${name}`]: res.data, [`${name}Loading`]: false });
      } catch (error) {
        this.setState({ [`${name}Loading`]: false, error });
      }
    }

    render() {
      return (
        <WrapperComponent
          providerActions={{ ...this.state, fetchActions: this.onFetch }}
          {...this.props}
        />
      );
    }
  }

  return withRouter(ProviderActions);
};
