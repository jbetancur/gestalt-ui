import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { withMetaResource } from 'modules/MetaResource';
import { withContext } from 'modules/ContextManagement';
import { tableActions } from 'modules/TableManager';
import APIItem from '../../components/APIItem';
import actions from '../../actions';

class APIListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    apis: PropTypes.array.isRequired,
    selectedAPIs: PropTypes.object.isRequired,
    deleteAPIs: PropTypes.func.isRequired,
    apisPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchAPIs: PropTypes.func.isRequired,
    unloadAPIs: PropTypes.func.isRequired,
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
    const { match, fetchAPIs } = this.props;
    fetchAPIs(match.params.fqon, match.params.environmentId);
  }

  componentWillUnmount() {
    const { unloadAPIs, clearTableSelected, clearTableSort } = this.props;
    unloadAPIs();
    clearTableSelected();
    clearTableSort();
  }

  create() {
    const { history, match } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/create`);
  }

  edit(api, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/${api.id}/edit`);
    }
  }

  delete() {
    const { match, fetchAPIs, deleteAPIs, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedAPIs;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
      fetchAPIs(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteAPIs(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  render() {
    return (
      <APIItem
        model={this.props.apis}
        pending={this.props.apisPending}
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
    apis: orderBy(state.metaResource.apis.apis, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedAPIs: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(withContext(APIListing)));
