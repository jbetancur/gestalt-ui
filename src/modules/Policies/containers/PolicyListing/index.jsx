import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import { withTableManager } from 'Modules/TableManager';
import PolicyItem from '../../components/PolicyItem';
import actions from '../../actions';

class PolicyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    policies: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    deletePolicies: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchPolicies: PropTypes.func.isRequired,
    unloadPolicies: PropTypes.func.isRequired,
    policiesPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchPolicies } = this.props;
    fetchPolicies(match.params.fqon, match.params.environmentId);
  }

  componentWillUnmount() {
    const { unloadPolicies } = this.props;

    unloadPolicies();
  }

  edit = (policy, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${policy.id}/edit`);
    }
  }

  delete = () => {
    const { match, fetchPolicies, deletePolicies, tableActions } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const IDs = items.map(item => (item.id));
    const names = items.map(item => (item.name));

    const onSuccess = () => {
      tableActions.clearTableSelected();
      fetchPolicies(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deletePolicies(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  render() {
    return (
      <PolicyItem
        model={this.props.policies}
        pending={this.props.policiesPending}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

export default withMetaResource(connect(null, { ...actions })(withContext(withTableManager(PolicyListing))));
