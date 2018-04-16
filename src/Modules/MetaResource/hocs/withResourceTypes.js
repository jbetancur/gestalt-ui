import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withResourceTypes(BaseComponent) {
  class ResourceTypes extends Component {
    static displayName = 'ResourceTypes(HOC)';
    static propTypes = {
      resourceTypesActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { resourceTypesActions } = this.props;

      resourceTypesActions.unloadResourceTypes();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    resourceTypes: state.metaResource.resourceTypes.resourceTypes,
    resourceTypesPending: state.metaResource.resourceTypes.pending,
  });

  const mapDispatchToProps = dispatch => ({
    resourceTypesActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'ResourceTypes'),
      createRequestAction(['delete'], 'ResourceType'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(ResourceTypes);
}
