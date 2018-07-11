import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class Groups extends Component {
    static displayName = 'Groups (HOC)';
    static propTypes = {
      groupsActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { groupsActions } = this.props;

        groupsActions.unloadGroups();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    groups: state.metaResource.groups.groups,
    groupsPending: state.metaResource.groups.pending,
  });

  const mapDispatchToProps = dispatch => ({
    groupsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'Groups'),
      createRequestAction(['delete'], 'Group'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Groups);
};
