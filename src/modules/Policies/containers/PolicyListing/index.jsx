import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import PolicyItem from '../../components/PolicyItem';
import actions from '../../actions';

class PolicyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    policies: PropTypes.array.isRequired,
    selectedPolicies: PropTypes.object.isRequired,
    deletePolicies: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchPolicies: PropTypes.func.isRequired,
    unloadPolicies: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    policiesPending: PropTypes.bool.isRequired,
  };

  constructor() {
    super();

    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const { match, fetchPolicies } = this.props;
    fetchPolicies(match.params.fqon, match.params.environmentId);
  }

  componentWillUnmount() {
    const { unloadPolicies, clearTableSelected, clearTableSort } = this.props;
    unloadPolicies();
    clearTableSelected();
    clearTableSort();
  }

  create() {
    const { match, history } = this.props;
    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/create`);
  }

  edit(policy, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${policy.id}/edit`);
    }
  }

  delete() {
    const { match, fetchPolicies, deletePolicies, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedPolicies;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
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
    policies: orderBy(state.metaResource.policies.policies, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedPolicies: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(withContext(PolicyListing)));
