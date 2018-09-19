import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default () => (BaseComponent) => {
  class Group extends Component {
    static displayName = 'Group (HOC)';

    static propTypes = {
      groupActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { groupActions } = this.props;

      groupActions.unloadGroup();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    group: state.groups.group.group,
    groupPending: state.groups.group.pending,
    groupMembersPending: state.groups.groupMembers.pending,
    groupUpdated: state.groups.groupMembers.group,
  });

  const mapDispatchToProps = dispatch => ({
    groupActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'Group'),
      createRequestAction(['add', 'remove'], 'GroupMember'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Group);
};
