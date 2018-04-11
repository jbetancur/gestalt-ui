import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { urlmapper } from 'Modules/MetaResource';
import { generateContextEntityState } from 'util/helpers/context';

export default ({ entity, label, params }) => (WrapperComponent) => {
  class DataPicker extends Component {
    static displayName = 'DataPicker(HOC)';
    static propTypes = {
      match: PropTypes.object.isRequired,
    };

    constructor(props) {
      super(props);

      this.state = { [`${entity}Data`]: [], [`${entity}Loading`]: false };
    }

    componentDidMount() {
      this.get();
    }

    async get() {
      const { match } = this.props;
      const entiryParams = generateContextEntityState(match.params);
      const urlConfig = { fqon: match.params.fqon, entityId: entiryParams.id, entityKey: entiryParams.key, params };
      const url = urlmapper.buildAllURL(entity, urlConfig, true);

      this.setState({ [`${entity}Loading`]: true });
      const res = await axios.get(url);

      try {
        if (res.data.length) {
          this.setState({ [`${entity}Data`]: res.data, [`${entity}Loading`]: false });
        } else {
          this.setState({ [`${entity}Data`]: [{ id: '', name: `No Available ${label}` }], [`${entity}Loading`]: false });
        }
      } catch (e) {
        this.setState({ [`${entity}Data`]: [{ id: '', name: `No Available ${label}` }], [`${entity}Loading`]: false });
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

  return DataPicker;
};
