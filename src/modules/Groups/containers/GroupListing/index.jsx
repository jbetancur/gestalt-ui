import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import GroupItem from '../../components/GroupItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    groups: sortBy(state.metaResource.groups.groups, 'name'),
    pending: state.metaResource.groups.pending,
    selectedGroups: state.groups.selectedGroups,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(GroupItem);
