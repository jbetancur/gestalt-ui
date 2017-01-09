import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserItem from '../../components/GroupItem';

import * as actions from '../../actions';

class Groups extends Component {
  static propTypes = {
    fetchGroups: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired
  };

  componentDidMount() {
    const fqon = this.props.fqon || this.props.router.params.fqon;
    this.props.fetchGroups(fqon);
  }

  render() {
    return (
      <div>
        <UserItem {...this.props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    groups: state.groups.fetchAll.items,
    pending: state.groups.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(Groups);
