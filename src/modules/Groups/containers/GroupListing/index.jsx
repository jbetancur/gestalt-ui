import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { withTableManager } from 'modules/TableManager';
import GroupItem from '../../components/GroupItem';
import actions from '../../actions';

class GroupListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    deleteGroups: PropTypes.func.isRequired,
    groupsPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    unloadGroups: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchGroups, match } = this.props;
    fetchGroups(match.params.fqon);
  }

  componentWillUnmount() {
    const { unloadGroups } = this.props;
    unloadGroups();
  }

  edit = (group, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      this.props.history.push(`/${this.props.match.params.fqon}/hierarchy/groups/${group.id}/edit`);
    }
  }

  delete = () => {
    const { match, fetchGroups, deleteGroups, tableActions } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const groupIds = items.map(item => (item.id));
    const groupsNames = items.map(item => (item.name));

    const onSuccess = () => {
      tableActions.clearTableSelected();
      fetchGroups(match.params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteGroups(groupIds, match.params.fqon, onSuccess);
    }, groupsNames);
  }

  render() {
    return (
      <GroupItem
        model={this.props.groups}
        pending={this.props.groupsPending}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

export default withMetaResource(connect(null, { ...actions })(withContext(withTableManager(GroupListing))));
