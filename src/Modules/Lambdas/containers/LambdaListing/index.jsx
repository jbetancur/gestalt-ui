import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import { withTableManager } from 'Modules/TableManager';
import LambdaItem from '../../components/LambdaItem';
import actions from '../../actions';

class LambdaListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    lambdas: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    deleteLambdas: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchLambdas: PropTypes.func.isRequired,
    unloadLambdas: PropTypes.func.isRequired,
    lambdasPending: PropTypes.bool.isRequired,
    fetchActions: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchLambdas, fetchActions } = this.props;

    fetchLambdas(match.params.fqon, match.params.environmentId);
    fetchActions(match.params.fqon, match.params.environmentId, 'environments', { filter: 'lambda.detail' });
  }

  componentWillUnmount() {
    const { unloadLambdas } = this.props;

    unloadLambdas();
  }

  edit = (lambda, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;

      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/lambdas/${lambda.id}/edit`);
    }
  }

  delete = () => {
    const { match, deleteLambdas, tableActions, fetchLambdas } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const IDs = items.map(item => (item.id));
    const names = items.map(item => (item.name));

    const onSuccess = () => {
      tableActions.clearTableSelected();
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

export default withTableManager(withMetaResource(connect(null, { ...actions })(withContext(LambdaListing))));
