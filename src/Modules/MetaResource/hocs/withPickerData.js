import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { orderBy } from 'lodash';
import { buildParams } from 'config/lib/urlmapper';
import withContext from '../../Hierarchy/hocs/withContext';

/**
 * ignore Context lets  you pass in a url as an entity rather than relying on ui context
 */
export default ({ entity, alias, label, params, sortKey = 'name', sortDirection = 'asc', fetchOnMount = true, ignoreContext = false }) => (WrapperComponent) => {
  class DataPicker extends Component {
    static displayName = 'DataPicker(HOC)';

    static propTypes = {
      hierarchyContext: PropTypes.object.isRequired,
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
      this.cancelSource = axios.CancelToken.source();
    }

    componentDidMount() {
      const { hierarchyContext: { contextFulfilled } } = this.props;
      // isMounted is Required wsince this is a dynamically named component
      this.$isMounted = true;

      if ((contextFulfilled && fetchOnMount) || ignoreContext) {
        this.get();
      }
    }

    componentDidUpdate(prevProps) {
      if (!ignoreContext) {
        const { hierarchyContext: { contextFulfilled } } = this.props;
        if (
          prevProps.hierarchyContext.contextFulfilled !== contextFulfilled
          && contextFulfilled
          && fetchOnMount
        ) {
          this.get();
        }
      }
    }

    componentWillUnmount() {
      this.$isMounted = false;
      this.cancelSource.cancel();
    }

    manualFetch = () => {
      this.get();
    }

    // we need to be extra vigilant! -_-
    safeSetState(state) {
      if (this.$isMounted) {
        this.setState(state);
      }
    }

    async get() {
      const name = alias || entity;
      const { hierarchyContext: { context } } = this.props;

      const url = ignoreContext
        ? buildParams(entity, params)
        : buildParams(`${context.contextMeta.baseHref}/${entity.toLowerCase()}`, params);

      this.safeSetState({ [`${name}Loading`]: true });

      try {
        const res = await axios.get(url, {
          cancelToken: this.cancelSource.token
        });

        if (res.data.length) {
          this.safeSetState({ [`${name}Data`]: orderBy(res.data, sortKey, sortDirection) });
        } else {
          // eslint-disable-next-line
          this.safeSetState({ [`${name}Data`]: [{ id: '', name: `No Available ${label}`, properties: {} }] });
        }
      } catch (error) {
        this.safeSetState({ [`${name}Data`]: [{ id: '', name: `No Available ${label}`, properties: {} }], error });
      } finally {
        this.safeSetState({ [`${name}Loading`]: false });
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

  return withContext()(DataPicker);
};
