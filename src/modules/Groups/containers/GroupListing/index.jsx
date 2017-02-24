import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import GroupItem from '../../components/GroupItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    groups: sortBy(state.groups.fetchAll.groups, 'name'),
    pending: state.groups.fetchAll.pending,
    selectedGroups: state.groups.selectedGroups,
  };
}

export default connect(mapStateToProps, actions)(GroupItem);
