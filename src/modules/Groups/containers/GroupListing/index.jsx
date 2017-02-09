import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GroupItem from '../../components/GroupItem';
import * as actions from '../../actions';

class GroupListing extends Component {
  static propTypes = {
    onUnload: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return <GroupItem {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    groups: state.groups.fetchAll.groups,
    pending: state.groups.fetchAll.pending,
    selectedGroups: state.groups.selectedGroups
  };
}

export default connect(mapStateToProps, actions)(GroupListing);
