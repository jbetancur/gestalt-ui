import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { orderBy } from 'lodash';
import { generateContextEntityState } from 'util/helpers/context';
import { buildAllURL } from '../lib/urlmapper';

export default ({ entity, alias, label, context = true, params, sortKey = 'name', sortDirection = 'asc', fetchOnMount = true }) => (WrapperComponent) => {
  class DataPicker extends Component {
    static displayName = 'DataPicker(HOC)';
    static propTypes = {
      match: PropTypes.object.isRequired,
    };

    constructor(props) {
      super(props);
      const name = alias || entity;

      this.state = {
        [`${name}Data`]: [],
        [`${name}Loading`]: false,
        error: {},
      };

      this.onFetch = { [`fetch${name}Data`]: this.manualFetch, [`${name}Data`]: [] };
    }

    componentDidMount() {
      // isMounted is Required wsince this is a dynamically named component
      this.$isMounted = true;

      if (fetchOnMount) {
        this.get();
      }
    }

    componentWillUnmount() {
      this.$isMounted = false;
    }

    manualFetch = () => {
      this.get();
    }

    async get() {
      const name = alias || entity;
      const { match } = this.props;
      const resolvedContext = generateContextEntityState(match.params);
      const urlConfig = context ? { fqon: match.params.fqon, entityId: resolvedContext.id, entityKey: resolvedContext.key, params } : { fqon: match.params.fqon, params };
      const url = buildAllURL(entity.toLowerCase(), urlConfig, true);

      if (this.$isMounted) this.setState({ [`${name}Loading`]: true });

      try {
        const res = await axios.get(url);

        if (res.data.length) {
          if (this.$isMounted) this.setState({ [`${name}Data`]: orderBy(res.data, sortKey, sortDirection) });
        } else {
          // eslint-disable-next-line
          if (this.$isMounted) this.setState({ [`${name}Data`]: [{ id: '', name: `No Available ${label}` }] });
        }
      } catch (error) {
        if (this.$isMounted) this.setState({ [`${name}Data`]: [{ id: '', name: `No Available ${label}` }], error });
      } finally {
        if (this.$isMounted) this.setState({ [`${name}Loading`]: false });
      }
    }

    render() {
      return (
        <WrapperComponent
          {...this.onFetch}
          {...this.state}
          {...this.props}
        />
      );
    }
  }

  return withRouter(DataPicker);
};
