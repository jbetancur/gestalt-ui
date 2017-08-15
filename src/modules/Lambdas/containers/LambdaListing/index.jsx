import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import LambdaItem from '../../components/LambdaItem';
import actions from '../../actions';

class LambdaListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    lambdas: PropTypes.array.isRequired,
    selectedLambdas: PropTypes.object.isRequired,
    deleteLambdas: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchLambdas: PropTypes.func.isRequired,
    unloadLambdas: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    lambdasPending: PropTypes.bool.isRequired,
    fetchActions: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const { match, fetchLambdas, fetchActions } = this.props;

    fetchLambdas(match.params.fqon, match.params.environmentId);
    fetchActions(match.params.fqon, match.params.environmentId, 'environments', { filter: 'lambda.detail' });
  }

  componentWillUnmount() {
    const { unloadLambdas, clearTableSelected, clearTableSort } = this.props;
    unloadLambdas();
    clearTableSelected();
    clearTableSort();
  }

  edit(lambda, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;

      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/lambdas/${lambda.id}/edit`);
    }
  }

  delete() {
    const { match, deleteLambdas, clearTableSelected, fetchLambdas } = this.props;
    const { selectedItems } = this.props.selectedLambdas;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
      fetchLambdas(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteLambdas(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  render() {
    return (
      <LambdaItem
        model={this.props.lambdas}
        pending={this.props.lambdasPending}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    lambdas: orderBy(state.metaResource.lambdas.lambdas, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedLambdas: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(withContext(LambdaListing)));
