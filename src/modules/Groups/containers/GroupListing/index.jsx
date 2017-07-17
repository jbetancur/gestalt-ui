import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import GroupItem from '../../components/GroupItem';
import actions from '../../actions';

class GroupListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    selectedGroups: PropTypes.object.isRequired,
    deleteGroups: PropTypes.func.isRequired,
    groupsPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    unloadGroups: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const { fetchGroups, match } = this.props;
    fetchGroups(match.params.fqon);
  }

  componentWillUnmount() {
    const { unloadGroups, clearTableSelected, clearTableSort } = this.props;
    unloadGroups();
    clearTableSelected();
    clearTableSort();
  }

  create() {
    const { history, match } = this.props;

    history.push(`/${match.params.fqon}/groups/create`);
  }

  edit(group, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      this.props.history.push(`/${this.props.match.params.fqon}/groups/${group.id}/edit`);
    }
  }

  delete() {
    const { match, fetchGroups, deleteGroups, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedGroups;
    const groupIds = selectedItems.map(item => (item.id));
    const groupsNames = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
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
        onCreateToggle={this.create}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedGroups: state.tableManager.tableSelected,
    groups: orderBy(state.metaResource.groups.groups, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(withContext(GroupListing)));
