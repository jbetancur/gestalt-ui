import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { generateContextEntityState } from 'util/helpers/context';
import { buildAllURL } from '../lib/urlmapper';

export default ({ entity, alias, label, context = true, params }) => (WrapperComponent) => {
  class DataPicker extends Component {
    static displayName = 'DataPicker(HOC)';
    static propTypes = {
      match: PropTypes.object.isRequired,
    };

    constructor(props) {
      super(props);
      const name = alias || entity;

      this.state = { [`${name}Data`]: [], [`${name}Loading`]: false };
    }

    componentDidMount() {
      this.get();
    }

    async get() {
      const name = alias || entity;
      const { match } = this.props;
      const entiryParams = generateContextEntityState(match.params);
      const urlConfig = context ? { fqon: match.params.fqon, entityId: entiryParams.id, entityKey: entiryParams.key, params } : { fqon: match.params.fqon, params };
      const url = buildAllURL(entity, urlConfig, true);

      this.setState({ [`${name}Loading`]: true });
      const res = await axios.get(url);

      try {
        if (res.data.length) {
          this.setState({ [`${name}Data`]: res.data, [`${name}Loading`]: false });
        } else {
          this.setState({ [`${name}Data`]: [{ id: '', name: `No Available ${label}` }], [`${name}Loading`]: false });
        }
      } catch (e) {
        this.setState({ [`${name}Data`]: [{ id: '', name: `No Available ${label}` }], [`${name}Loading`]: false });
      }
    }

    render() {
      return (
        <WrapperComponent
          {...this.state}
          {...this.props}
        />
      );
    }
  }

  return withRouter(DataPicker);
};
