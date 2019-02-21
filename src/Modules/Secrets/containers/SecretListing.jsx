import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { SecretIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import { Checkbox, FontIcon } from 'react-md';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { generateContextEntityState } from 'util/helpers/context';
import withSecrets from '../hocs/withSecrets';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class SecretListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    secrets: PropTypes.array.isRequired,
    secretsActions: PropTypes.object.isRequired,
    secretsPending: PropTypes.bool.isRequired,
  };

  static contextType = ModalConsumer;

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.init();
  }

  init() {
    const { match, secretsActions } = this.props;
    const entity = generateContextEntityState(match.params);

    secretsActions.fetchSecrets({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key });
  }

  deleteOne = (row) => {
    const { match, secretsActions } = this.props;
    const { showModal } = this.context;
    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.init();
    };

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete ${row.name}?`,
      onProceed: ({ force }) => secretsActions.deleteSecret({ fqon: match.params.fqon, resource: row, onSuccess, params: { force } }),
    });
  }


  deleteMultiple = () => {
    const { match, secretsActions } = this.props;
    const { selectedRows } = this.state;
    const { showModal } = this.context;
    const names = selectedRows.map(item => item.name);

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.init();
    };

    showModal(ConfirmModal, {
      title: 'Confirm Deleting Multiple Secrets',
      multipleItems: names,
      onProceed: ({ force }) => secretsActions.deleteSecrets({ resources: selectedRows, fqon: match.params.fqon, onSuccess, params: { force } }),
    });
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(`${match.url}/${row.id}`);
  }

  defineContextActions() {
    return [
      <DeleteIconButton key="delete-items" onClick={this.deleteMultiple} />,
    ];
  }

  defineColumns() {
    return [
      {
        width: '56px',
        button: true,
        allowOverflow: true,
        ignoreRowClick: true,
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            editURL={`${this.props.match.url}/${row.id}`}
            entityKey="secrets"
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 3,
        cell: row => <Name name={row.name} description={row.description} />
      },
      {
        name: 'Provider',
        selector: 'properties.provider.name',
        sortable: true,
      },
      {
        name: 'Owner',
        selector: 'owner.name',
        sortable: true,
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
      {
        name: 'Modified',
        selector: 'modified.timestamp',
        sortable: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.modified.timestamp} />
      },
    ];
  }

  render() {
    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <DataTable
            title="Secrets"
            data={this.props.secrets}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.secretsPending}
            progressComponent={<LinearProgress id="secret-listing" />}
            columns={this.defineColumns()}
            contextActions={this.defineContextActions()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no secrets to display" icon={<SecretIcon size={150} />} />}
            onRowClicked={this.handleRowClicked}
            subHeader
            subHeaderComponent={<SelectFilter disabled={this.props.secretsPending} />}
            pagination
            paginationPerPage={15}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  secrets: listSelectors.filterItems()(state, 'secrets.secrets.secrets'),
});

export default compose(
  withSecrets,
  connect(mapStateToProps),
)(SecretListing);
