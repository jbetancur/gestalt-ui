import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withresourceType(BaseComponent) {
  class ResourceType extends Component {
    static displayName = 'ResourceType(HOC)';
    static propTypes = {
      resourceTypeActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { resourceTypeActions } = this.props;

      resourceTypeActions.unloadResourceType();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    resourceType: state.metaResource.resourceType.resourceType,
    resourceTypePending: state.metaResource.resourceType.pending,
  });

  const mapDispatchToProps = dispatch => ({
    resourceTypeActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'ResourceType'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(ResourceType);
}
