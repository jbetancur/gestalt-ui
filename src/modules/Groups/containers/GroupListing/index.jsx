import { connect } from 'react-redux';
import GroupItem from '../../components/GroupItem';

import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    groups: state.groups.fetchAll.groups,
    pending: state.groups.fetchAll.pending,
    selectedGroups: state.groups.selectedGroups
  };
}

export default connect(mapStateToProps, actions)(GroupItem);
