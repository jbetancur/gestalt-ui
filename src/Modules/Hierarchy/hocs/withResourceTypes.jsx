import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';

export default function withResourceTypes(BaseComponent) {
  class ResourceTypes extends PureComponent {
    static propTypes = {
      fetchResourceTypes: PropTypes.func.isRequired,
    };

    componentDidMount() {
      const { fetchResourceTypes } = this.props;

      fetchResourceTypes('root');
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  return compose(
    withMetaResource,
  )(ResourceTypes);
}
